import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { Roles } from "../decorator/roles.decorator";
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const roles = this.reflector.get(Roles, context.getHandler());
        const role = req?.user.roleone;
        const matchRole = role.some(role => roles.includes(role));
        if (!matchRole) {
            return matchRole;
        }
        return matchRole
    }
}
