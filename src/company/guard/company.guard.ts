import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CompanyGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const header = req.headers.authorization || req.headers.Authorization;
        //console.log(header);
        if (!header || !header.includes("Bearer ")) {
            return false;
        }
        const jwtToken = header.split(' ')
        const decodeToken = await this.jwtService.verifyAsync(jwtToken[1]);
       
        req["user"] = decodeToken;
        return true;
    }
}
