import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Company, CompanySchema } from "./schema/company.schema";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
      UsersModule,
        MongooseModule.forFeature([
            {
                name: Company.name,
                schema: CompanySchema
            }
        ])
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports:[CompanyService]
})
export class CompanyModule {}
