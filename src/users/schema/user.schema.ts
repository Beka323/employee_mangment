import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true
})
export class User {
    @Prop({ type: String })
    username: string;
    @Prop({ type: String })
    firstname: string;
    @Prop({ type: String })
    lastname: string;
    @Prop({ type: String })
    email: string;
    @Prop({ type: String })
    password: string;
    @Prop({ type: String })
    position: string;
    @Prop({ type: String, enum: ["admin", "user", "editor"], default: "user" })
    role: string;
    @Prop({ type: String })
    companyname: string;
    @Prop({ type: String })
    secureImgUrl: string;
    @Prop({ type: String })
    imgUrl: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
