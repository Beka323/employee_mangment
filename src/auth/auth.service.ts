import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { userDto } from "../users/dto/user.dto";
import { loginDto } from "../users/dto/login.dto";
import { AdminDto } from "../users/dto/admin.dto";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}
    async createNewUser(user: userDto): Promise<{ msg: string } | any> {
        return this.usersService.createNewUser(user);
    }
    async loginUser(user: loginDto): Promise<{ token: string,roles:string[] }> {
        return this.usersService.login(user);
    }
    async createAdmin(admin: AdminDto):Promise<{msg:string} | any> {
       return this.usersService.createAdminUser(admin);
    }
}
