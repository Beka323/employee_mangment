import { Controller, Req, Get, UseGuards, Patch,Body } from "@nestjs/common";
import { UserGuard } from "./guard/users.guard";
import { UsersService } from "./users.service";
import { updateUserDto } from "./dto/update.dto";

//import { userDto } from ""
interface FoundUser {
    _id: Object;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roleone: string[];
    companyname: string;
}
@UseGuards(UserGuard)
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
    ): Promise<{ msg: string,status:boolean }> {
        return this.usersService.editProfile(user, req.user.id);
    }
}
