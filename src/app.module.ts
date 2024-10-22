import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "./users/users.module";
import { CompanyModule } from "./company/company.module";
import { ProjectModule } from "./project/project.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
        AuthModule,
        UsersModule,
        CompanyModule,
        ProjectModule
    ]
})
export class AppModule {}
