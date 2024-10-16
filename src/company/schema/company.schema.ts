import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ComapnyDocument = HydratedDocument<Company>;
@Schema({
    timestamps: true
})
export class Company {
    @Prop({ type: String })
    companyname: string;
    @Prop({ type: String })
    description: string;
    @Prop({ type: Object })
    createdBy: string;
    @Prop({ type: String })
    companyadmin: string;
    @Prop([String])
    members: string[];
}
export const CompanySchema = SchemaFactory.createForClass(Company);