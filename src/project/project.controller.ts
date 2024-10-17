import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    UseGuards
} from "@nestjs/common";
// Importing guards
import { ProjectGuard } from "./guard/project.guard";
import { RolesGuard } from "./guard/roles.guard";
import { Roles } from "./decorator/roles.decorator";
@UseGuards(ProjectGuard)
@Controller("project")
export class ProjectController {
    @UseGuards(RolesGuard)
    @Roles(["USER"])
    @Get()
    getAllProject(): String {
        return;
    }
    // create new Project
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Post()
    async createProject() {}
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Patch()
    async updateProject() {}
    @UseGuards(RolesGuard)
    @Roles(["ADMIN"])
    @Delete()
    async cancleProject() {}
}
