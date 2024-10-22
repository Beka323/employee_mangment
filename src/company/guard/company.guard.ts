import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CompanyGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractToken(req);
        if (!token) {
            throw new UnauthorizedException();
        }
        const jwtSecret = this.configService.get<string>("JWT_SECRET");
        try {
            const decodeToken = await this.jwtService.verifyAsync(token, {
                secret: jwtSecret
            });
            req["user"] = decodeToken;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
    private extractToken(req: Request): string {
        const [type, token] = req.headers?.authorization.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
