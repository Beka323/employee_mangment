import {
    Length,
    IsString,
    IsEmail,
    Max,
    Min,
    IsNotEmpty
} from "class-validator";

export class userDto {
    @IsString()
    @IsNotEmpty()
    username: string;
    @IsString()
    @IsNotEmpty()
    firstname: string;
    @IsString()
    @IsNotEmpty()
    lastname: string;
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @Length(4, 15)
    password: string;
    @IsString()
    @IsNotEmpty()
    position: string;
    @IsString()
    @IsNotEmpty()
    companyname: string;
}
