import { Controller, Req, Get, UseGuards, Patch, Body,Param} from "@nestjs/common";
import { UserGuard } from "./guard/users.guard";
import { UsersService } from "./users.service";
import { updateUserDto } from "./dto/update.dto";
import { RoleGuard } from "./guard/role.gurads";
import { Roles } from "./roles.decorator";

//import { userDto } from ""
interface FoundUser {
    _id: Object;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    position: string;
    companyname: string;
}
@UseGuards(UserGuard, RoleGuard)
@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Get()
    async userInfo(@Req() req): Promise<FoundUser> {
        return this.usersService.findUserById(req.user.id);
    }
    @Patch("/editprofile")
    async editProfile(
        @Body() user: updateUserDto,
        @Req() req
    ): Promise<{ msg: string; status: boolean }> {
        return this.usersService.editProfile(user, req.user.id);
    }
    @Roles(["admin"])
    @Patch("roles/:id")
    async editRole(
        @Param("id") id: string,
        @Body('role') role: string
    ): Promise<{ msg: string; status: boolean }> {
       return this.usersService.giveRole(id, role);
    }
}
