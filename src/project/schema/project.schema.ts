import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
export type ProjectDoc = HydratedDocument<Project>;
@Schema({ timestamps: true })
export class Project {
    @Prop({ type: String })
    name: string;
    @Prop({ type: String })
    createBy: string;
    @Prop({type:String})
    projectadmin:string;
    @Prop({ type: String })
    progress: string;
    @Prop({ type: String })
    status: string;
    @Prop([
        {
            id: { type: String },
            body: { type: String }
        }
    ])
    tasks: { id: string; body: string }[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
