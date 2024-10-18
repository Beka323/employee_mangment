import { Injectable, ForbiddenException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ProjectDto } from "./dto/project.dto";
import { Project } from "./schema/project.schema";
import { UsersService } from "../users/users.service";
import { CompanyService } from "../company/company.service";
import { Request } from "express";
interface ProjectType {
    name: string;
    createdBy: string;
    progress: string;
    status: string;
}
@Injectable()
export class ProjectService {
    constructor(
        @InjectModel(Project.name) private projectModel: Model<Project>,
        private usersService: UsersService,
        private companyService: CompanyService
    ) {}
    async getAll(id: string): Promise<ProjectType[]> {
        const company = await this.companyService.findCompany(id);
        const projects = await this.projectModel.find({
            _id: { $in: company.projects }
        });
        const formattedProject = projects.map(project => {
            const formatedPro = {
                name: project.name,
                createdBy: project.createBy,
                progress: project.progress,
                status: project.status
            };
            return formatedPro;
        });
        return formattedProject;
    }
    async createProject(body: ProjectDto, req): Promise<{ msg: string }> {
        const findUser = await this.usersService.findUserById(
            Object(req.user.id)
        );
        const findCompany = await this.companyService.findByAdmin(req.user.id);
        const newProject = {
            name: body.name,
            createBy: findUser.username,
            projectadmin: findUser._id,
            progress: body.progress,
            status: body.status,
            tasks: []
        };
        const createProject = new this.projectModel(newProject);
        createProject.save();
        await this.companyService.addProjectToCompany(
            findCompany._id,
            createProject._id.toString()
        );
        return { msg: "created" };
    }
    // update Progress
    async updateProgress(
        id: string,
        body: { progress: string },
        reqId: string
    ): Promise<{ msg: string }> {
        const findProject = await this.projectModel.findById(id);
        if (findProject.projectadmin !== reqId) {
            throw new ForbiddenException("only project admin can update");
        }
        const updateProgress = await this.projectModel.findOneAndUpdate(
            { _id: Object(id) },
            {
                $set: {
                    progress: body.progress
                }
            }
        );
        updateProgress.save();
        return { msg: "updated" };
    }
    // Add Task
    async addTask(
        id: string,
        body: { task: string },
        adminId: string
    ): Promise<{ msg: string }> {
        const findProject = await this.projectModel.findById(id);
        if (findProject.projectadmin !== adminId) {
            throw new ForbiddenException("only project admin can update");
        }
        const task = {
            id: adminId,
            body: body.task
        };
        const addTask = await this.projectModel.findOneAndUpdate(
            {
                _id: Object(id)
            },
            {
                $push: {
                    tasks: task
                }
            }
        );
        addTask.save();
        return { msg: "task added" };
    }
    // remove task
    async removeTask(proid: {
        id: string;
        taskid: string;
    }): Promise<{ msg: string }> {
        const removeTask = await this.projectModel.findOneAndUpdate(
            { _id: Object(proid.id) },
            {
                $pull: {
                    tasks: {
                        _id: Object(proid.taskid)
                    }
                }
            }
        );
        removeTask.save();
        return { msg: "removed" };
    }
    async cancleProject(id: string, adminId: string): Promise<{ msg: string }> {
        await this.companyService.removeProject(id, adminId);
        const deleteProject = await this.projectModel.deleteOne({_id:Object(id)})

        return { msg: "removed" };
    }
}
