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
import { AdminDto } from "./dto/admin.dto";

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
@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ) {}
    async findUser(user) {
        const findUser = await this.userModel
            .findOne({ email: user.email })
            .exec();
        if (findUser) {
            throw new ConflictException("Email already exisist");
        }
    }
    async findUserById(id: number): Promise<FoundUser> {
        const user = await this.userModel.findById(id);
        user.password = "";
        return user;
    }
    async findAll(memberId: string[]): Promise<FoundUser[]> {
        const allUser = await this.userModel
            .find({ _id: { $in: memberId } })
            
        return allUser;
    }
    async createNewUser(user: userDto): Promise<{ msg: string } | any> {
        await this.findUser(user);
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(user.password, salt);

        const createUser = {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: hashPwd,
            roleone: ["USER", user.roleone],
            companyname: user.companyname
        };
        const newUser = new this.userModel(createUser);
        newUser.save();
        return { msg: "successfully created" };
    }
    async login(user: loginDto): Promise<{ token: string }> {
        const foundUser = await this.userModel
            .findOne({ username: user.username })
            .exec();
        if (!foundUser) {9
            throw new NotFoundException("user not found");
        }
        const match = await bcrypt.compare(user.password, foundUser.password);
        if (!match) {
            throw new BadRequestException("password doesn't match");
        }
        const payload = {
            id: foundUser.id,
            roleone: foundUser.roleone
        };
        const token = await this.jwtService.signAsync(payload);

        return { token };
    }
    async createAdminUser(admin: AdminDto): Promise<{ msg: string } | any> {
        await this.findUser(admin);
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(admin.password, salt);
        const adminUser = {
            username: admin.username,
            firstname: admin.firstname,
            lastname: admin.lastname,
            email: admin.email,
            password: hashPwd,
            roleone: ["ADMIN", admin.roleone],
            companyname: admin.companyname
        };
        const createAdmin = new this.userModel(adminUser);
        createAdmin.save();
        return { msg: "successfully created" };
    }
}
