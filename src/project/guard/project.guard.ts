import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtSecret } from "../../users/secret";
import { Request } from "express";
@Injectable()
export class ProjectGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = context.switchToHttp().getRequest();
        const token = this.extractToken(req);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const decodeToken = await this.jwtService.verifyAsync(token, {
                secret: jwtSecret.secret
            });
            req["user"] = decodeToken;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
    private extractToken(req: Request): string | undefined {
        const [type, token] = req.headers?.authorization.split(" ") ?? [];
        return type == "Bearer " ? token : undefined;
    }
}
