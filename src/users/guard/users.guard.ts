import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { ConfigService } from "@nestjs/config";
@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const token = this.extractToken(req);
        if (!token) {
            return false;
        }
        const jwtSecret = this.configService.get<string>("JWT_SECRET");
        try {
            const decodeToken = await this.jwtService.verifyAsync(token, {
                secret: jwtSecret
            });
            req["user"] = decodeToken;
            return true;
        } catch {
            return false;
        }
    }
    extractToken(req: Request): string | undefined {
        const [type, token] = req.headers?.authorization.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
