import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import { loginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { User } from "./schema/user.schema";
import { userDto } from "./dto/user.dto";
import { updateUserDto } from "./dto/update.dto";
import { UploadService } from "../upload/upload.service";
import { Express } from "express";
interface FoundUser {
    _id: Object;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    position: string;
    companyname: string;
    role: string;
}
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private uploadService: UploadService
    ) {}
    // Find User By Email
    async findUser(email) {
        const findUser = await this.userModel.findOne({ email: email }).exec();

        if (findUser) {
            throw new ConflictException("Email already exisist");
        }
    }
    // find user By Company name
    async findUserByComapnyname(name: string): Promise<any> {
        const users = await this.userModel.find({ companyname: name }).exec();
        return users;
    }
    // Find user by id
    async findUserById(id: number): Promise<FoundUser> {
        const user = await this.userModel.findById(id);
        user.password = "";
        return user;
    }
    async findAll(memberId: string[]): Promise<FoundUser[]> {
        const allUser = await this.userModel.find({ _id: { $in: memberId } });

        return allUser;
    }
    // Register new User
    async createNewUser(user: userDto): Promise<{ msg: string } | any> {
        await this.findUser(user.email);

        const genSalt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(user.password, genSalt);
        const newUser = {
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            email: user.email,
            password: hashPwd,
            position: user.position,
            companyname: user.companyname
        };
        const createUser = new this.userModel(newUser);
        createUser.save();

        return { msg: "successfully created" };
    }
    // User Login Method
    async login(user: loginDto): Promise<{ token: string }> {
        const foundUser = await this.userModel
            .findOne({ username: user.username })
            .exec();

        if (!foundUser) {
            throw new NotFoundException("user not found");
        }

        const match = await bcrypt.compare(user.password, foundUser.password);
        if (!match) {
            throw new BadRequestException("password doesn't match");
        }
        const payload = {
            id: foundUser.id,
            role: foundUser.role
        };
        const token = await this.jwtService.signAsync(payload);
      
        return { token };
    }
    async editProfile(
        user: updateUserDto,
        id: string
    ): Promise<{ msg: string; status: boolean }> {
        const updateUser = await this.userModel.findByIdAndUpdate(id, user);
        updateUser.save();
        return { msg: "user profile updated", status: true };
    }
    async assignRole(id: string): Promise<any> {
        const findUser = await this.userModel.findOne({ _id: id });
        if (!findUser) {
            throw new NotFoundException("no user found");
        }
        findUser.role = "admin";
        findUser.save();
    }
    async giveRole(
        userId: string,
        role: string
    ): Promise<{ msg: string; status: boolean }> {
        const findUser = await this.userModel.findById(userId);
        console.log(findUser);
        findUser.role = role;
        findUser.save();
        return { msg: "updated", status: true };
    }
}
