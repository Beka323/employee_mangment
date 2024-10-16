import {
    Controller,
    Body,
    Post,
    Get,
    UseGuards,
    Req,
    Param,
    Patch,
    Delete
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyGuard } from "./guard/company.guard";
import { Request } from "express";
import { CompanyDto } from "./dto/company.dto";
import { Roles } from "./decorator/role.decorator";
import { RoleGuard } from "./guard/role.guard";

@UseGuards(CompanyGuard)
@Controller("company")
export class CompanyController {
    constructor(private companyService: CompanyService) {}
    @Get("members/:id")
    async getAll(@Param('id') id:string): Promise<any> {
        return this.companyService.findAll(id);
    }
    @UseGuards(RoleGuard)
    @Roles(["ADMIN"])
    @Post("register")
    async registerCompany(
        @Body() body: CompanyDto,
        @Req() req: Request
    ): Promise<{ msg: string }> {
        return this.companyService.registerCompany(body, req);
    }
    @UseGuards(RoleGuard)
    @Roles(["ADMIN"])
    @Patch(":id/:userid")
    async addMember(
        @Param() param: { id: string; userid: string }
    ): Promise<{ msg: string }> {
        return this.companyService.addMember(param);
    }
    @UseGuards(RoleGuard)
    @Roles(["ADMIN"])
    @Delete(":id/:userid")
    async removeMember(
        @Param() param: { id: string; userid: string }
    ): Promise<{ msg: string }> {
        return this.companyService.removeMember(param);
    }
}
