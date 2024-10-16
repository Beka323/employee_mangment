import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorator/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private roleReflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const roles = this.roleReflector.get(Roles, context.getHandler());
        const userRole = req.user.roleone;
        const match = userRole.some(role => roles.includes(role));
        if (!match) {
            throw new ForbiddenException("you have no access to do this");
        }
        return true;
    }
}
