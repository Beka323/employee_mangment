import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { Express } from "express";
import * as Cloudinary from "cloudinary";
import { userDto } from "../users/dto/user.dto";
import { loginDto } from "../users/dto/login.dto";
import { AdminDto } from "../users/dto/admin.dto";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService
    ) {}
    async createNewUser(user: userDto): Promise<{ msg: string } | any> {
        return this.usersService.createNewUser(user);
    }
    async loginUser(
        user: loginDto
    ): Promise<{ token: string; roles: string[] }> {
        return this.usersService.login(user);
    }
    async createAdmin(admin: AdminDto): Promise<{ msg: string } | any> {
        return this.usersService.createAdminUser(admin);
    }
    async fileUpload(image: Express.Multer.File): Promise<{ msg: string }> {
        const cloudName = this.configService.get<string>("CLOUD_NAME");
        const apiSecret = this.configService.get<string>("API_SECRET");
        const apiKey = this.configService.get<string>("API_KEY");
        //console.log(cloudName,apiSecret,apiKey)
       /* Cloudinary.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });*/
       /* const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true
        };*/
       /* try {
          const result = await Cloudinary.v2.uploader.upload(image.buffer, options);
            console.log("-----  suucessfully uploaded", result);
        } catch (err) {
           console.error(err);
        }
        console.log(Cloudinary.v2.config());*/
        
        console.log(image);
        return { msg: "successfully uploaded" };
    }
}
