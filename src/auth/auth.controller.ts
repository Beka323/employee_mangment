import { Controller, Post, Body } from "@nestjs/common";
import { userDto } from "../users/dto/user.dto";
import { AuthService } from "./auth.service";
import { loginDto } from "../users/dto/login.dto";
import { AdminDto } from "../users/dto/admin.dto";
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post("register")
    async createNew(@Body() user: userDto): Promise<{ msg: string } | any> {
     return  this.authService.createNewUser(user);
    }
    @Post("login")
    async login(@Body() user: loginDto): Promise<{ token: string }> {
        return this.authService.loginUser(user);
    }
    @Post("admin")
    async createAdmin(@Body() admin: AdminDto):Promise<{ msg:string} | any> {
       return this.authService.createAdmin(admin);
    }
}
