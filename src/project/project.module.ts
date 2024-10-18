import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { Project, ProjectSchema } from "./schema/project.schema";
import { UsersModule } from "../users/users.module";
import { CompanyModule } from "../company/company.module";
@Module({
    imports: [
        UsersModule,
        CompanyModule,
        MongooseModule.forFeature([
            {
                name: Project.name,
                schema: ProjectSchema
            }
        ])
    ],
    controllers: [ProjectController],
    providers: [ProjectService]
})
export class ProjectModule {}
