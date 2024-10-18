import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    UseGuards,
    Req,
    Body,
    Param
} from "@nestjs/common";
import { Request } from "express";

// Importing guards
import { ProjectGuard } from "./guard/project.guard";
import { RolesGuard } from "./guard/roles.guard";
import { ProjectService } from "./project.service";
import { Roles } from "./decorator/roles.decorator";
import { ProjectDto } from "./dto/project.dto";
@UseGuards(ProjectGuard)
@Controller("project")
export class ProjectController {
    constructor(private projectService: ProjectService) {}
    @Get("projects/:id")
    async getAllProject(@Param("id") id: string): Promise<any[]> {
        const projects = await this.projectService.getAll(id);
        return projects;
    }
    // create new Project
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Post()
    async createProject(
        @Body() body: ProjectDto,
        @Req() req: Request
    ): Promise<{ msg: string }> {
        return this.projectService.createProject(body, req);
    }
    // Update progress
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Patch("updateprogress/:id")
    async updateProgress(
        @Param("id") id: string,
        @Body() body: { progress: string },
        @Req() req
    ): Promise<{ msg: string }> {
        return this.projectService.updateProgress(id, body, req.user.id);
    }
    // Remove Task()
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Patch("removetask/:id/:taskid")
    async removeTask(@Param() id: { id: string; taskid: string }) {
        return this.projectService.removeTask(id);
    }
    // Add Task
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Patch(":id")
    async addTask(
        @Param("id") id: string,
        @Body() body: { task: string },
        @Req() req
    ) {
        return this.projectService.addTask(id, body, req.user.id);
    }
    // Cancel Project
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Delete(":id")
    async cancleProject(
        @Param("id") id: string,
        @Req() req
    ): Promise<{ msg: string }> {
        return this.projectService.cancleProject(id, req.user.id);
    }
}
