import { Injectable, BadRequestException } from "@nestjs/common";
import { Express } from "express";
import { ConfigService } from "@nestjs/config";
import * as Cloudinary from "cloudinary";
@Injectable()
export class UploadService {
    constructor(private configService: ConfigService) {}
    async uploadImage(image: Express.Multer.File): Promise<any> {
        const cloudName = this.configService.get<string>("CLOUD_NAME");
        const apiSecret = this.configService.get<string>("API_SECRET");
        const apiKey = this.configService.get<string>("API_KEY");

        Cloudinary.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });
        try {
            const result = await Cloudinary.v2.uploader.upload(image.path);
          
            return result;
        } catch (err) {
            console.log(err);
            throw new BadRequestException("unable to upload image");
        }
    }
}
