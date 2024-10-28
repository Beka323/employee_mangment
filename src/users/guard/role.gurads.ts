import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../users.service";
import { Roles } from "../roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const role = this.reflector.get(Roles, context.getHandler());
        const findUser = await this.usersService.findUserById(req.user.id);
        if (role[0] !== findUser.role) {
            return false;
        }
        return true;
    }
}
