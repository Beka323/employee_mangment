import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
@Injectable()
export class ProjectGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
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
    private extractToken(req: Request): string | undefined {
        const [type, token] = req.headers?.authorization.split(" ") ?? [];
        return type == "Bearer" ? token : undefined;
    }
}
