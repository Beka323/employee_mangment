import { userDto } from "./user.dto";
import { PartialType } from "@nestjs/mapped-types";

export class updateUserDto extends PartialType(userDto) {}
