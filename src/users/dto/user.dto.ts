import { IsString, IsEmail, Max, Min, IsNotEmpty } from "class-validator";

export class userDto {
    @IsString()
    @IsNotEmpty()
    @Min(4)
    @Max(10)
    username: string;
    @IsString()
    @IsNotEmpty()
    @Min(3)
    @Max(8)
    firstname: string;
    @IsString()
    @IsNotEmpty()
    lastname: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    @IsNotEmpty()
    @IsString()
    roleone: string;
    @IsNotEmpty()
    @IsString()
    companyname: string;
}
