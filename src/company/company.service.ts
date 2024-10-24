import {
    Injectable,
    ConflictException,
    ForbiddenException
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "./schema/company.schema";
import { CompanyDto } from "./dto/company.dto";
import { userDto } from "../users/dto/user.dto";
import { UsersService } from "../users/users.service";

interface company {
    companyname: string;
    description: string;
    createdBy: Object;
    companyadmin: string;
    members: string[];
    projects: string[];
}
@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
        private usersService: UsersService
    ) {}

    //,Find All Members
    async findAll(id: string): Promise<any> {
        const allMembers = await this.companyModel.findById(id);
        const members = await this.usersService.findAll(allMembers.members);
        const formattedMember = members.map(member => {
            const members = {
                id: member._id,
                username: member.username,
                firstname: member.firstname,
                lastname: member.lastname,
                image: member.secureImgUrl,
                role: member.roleone
            };
            return members;
        });
        return { member: formattedMember };
    }
    //,Find single company
    async findCompany(id: string): Promise<company> {
        const foundCompany = await this.companyModel.findById(id);
        return foundCompany;
    }
    // Finding company by admin
    async findByAdmin(id: string): Promise<any> {
        const company = await this.companyModel
            .findOne({
                createdBy: id
            })
            .exec();
        return company;
    }

    // check if the user is found is company
    async checkExsistance(
        id: string
    ): Promise<{ msg: string; status: boolean; data?: company }> {
        const check = await this.findByAdmin(id);
        if (!check) {
            const findByMember = await this.companyModel.findOne({
                members: id
            });
            if (!findByMember) {
                return { msg: "not found", status: false, data: null };
            }
            return { msg: "found", status: true, data: findByMember };
        }
        return { msg: "found", status: true, data: check };
    }
    // Suggest users
    async suggestion(id: string): Promise<any> {
        const findCompany = await this.findCompany(id);

        const users = await this.usersService.findUserByComapnyname(
            findCompany.companyname
        );
        const filterUser = users.filter(
            user => user._id.toString() !== findCompany.createdBy
        );
        const suggestion = filterUser.filter(
            user => !findCompany.members.includes(user._id.toString())
        );
        const formatSuggestion = suggestion.map(user => {
            const users = {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                image: user.secureImgUrl,
                imgUrl: user.imgUrl,
                cpname:user.companyname,
                role:user.roleone
            };
            return users;
        });
        return formatSuggestion;
    }
    // Register company
    async registerCompany(
        company: CompanyDto,
        req: any
    ): Promise<{ msg: string; companyName: string; comId: string }> {
        const currentUser = await this.usersService.findUserById(req.user.id);
        const registerCompany = {
            companyname: company.name,
            description: company.description,
            createdBy: currentUser._id,
            companyadmin: currentUser.username,
            members: []
        };
        const createCompany = new this.companyModel(registerCompany);
        createCompany.save();
        return {
            msg: "company register",
            companyName: createCompany.companyname,
            comId: createCompany._id.toString()
        };
    }
    // Add Project to comapny
    async addProjectToCompany(id: Object, projectId: string) {
        const addProject = await this.companyModel.findOneAndUpdate(
            { _id: Object(id) },
            {
                $push: {
                    projects: projectId
                }
            }
        );
        addProject.save();
    }
    // Remove project from comapny
    async removeProject(id: string, adminId: string) {
        const removeProject = await this.companyModel.findOneAndUpdate(
            { createdBy: adminId },
            {
                $pull: {
                    projects: id
                }
            }
        );
        removeProject.save();
    }
    // add member
    async addMember(param: {
        id: string;
        userid: string;
    }): Promise<{ msg: string }> {
        const checkExist = await this.findCompany(param.id);
        const findUser = await this.usersService.findUserById(
            Object(param.userid)
        );
        if (findUser.companyname !== checkExist.companyname) {
            throw new ForbiddenException(" not allowed");
        }
        if (checkExist.members.includes(param.userid)) {
            throw new ConflictException("user exist in member");
        }
        const addMember = await this.companyModel.findOneAndUpdate(
            { _id: Object(param.id) },
            {
                $push: {
                    members: param.userid
                }
            }
        );
        addMember.save();
        return { msg: "added" };
    }
    // Remove members
    async removeMember(param: {
        id: string;
        userid: string;
    }): Promise<{ msg: string }> {
        const FoundCompany = await this.companyModel.findOneAndUpdate(
            { _id: Object(param.id) },
            {
                $pull: {
                    members: param.userid
                }
            }
        );
        await FoundCompany.save();
        return { msg: "removed" };
    }
}
