import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    username: string;
    @Prop()
    firstname: string;
    @Prop()
    lastname: string;
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop([String])
    roleone: string[];
    @Prop()
    companyname: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
