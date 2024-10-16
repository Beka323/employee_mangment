import { Injectable, ConflictException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Company } from "./schema/company.schema";
import { CompanyDto } from "./dto/company.dto";
import { userDto } from "../users/dto/user.dto";
import { UsersService } from "../users/users.service";
interface company {
    companyname: string;
    description: string;
    createdBy: string;
    companyadmin: string;
    members: string[];
}
@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
        private usersService: UsersService
    ) {}
    async findAll(id: string): Promise<any> {
        const allMembers = await this.companyModel.findById(id);
        const members = await this.usersService.findAll(allMembers.members);
        const formattedMember = members.map(member => {
            const members = {
                id: member._id,
                username: member.username,
                firstname: member.firstname,
                lastname: member.lastname
            };
            return members;
        });

        return { member: formattedMember };
    }
    async findCompany(id: string): Promise<company> {
        const foundCompany = await this.companyModel.findById(id);

        return foundCompany;
    }
    async registerCompany(
        company: CompanyDto,
        req: any
    ): Promise<{ msg: string }> {
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
        return { msg: "company register" };
    }
    async addMember(param: {
        id: string;
        userid: string;
    }): Promise<{ msg: string }> {
        const checkExist = await this.findCompany(param.id);
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