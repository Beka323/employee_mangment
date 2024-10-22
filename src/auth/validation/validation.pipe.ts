import { PipeTransform, ArgumentMetadata, Injectable } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
       let oneKb = 1000 
       return value.size > oneKb
    }
}
