import {
    PipeTransform,
    ArgumentMetadata,
    Injectable,
    BadRequestException
} from "@nestjs/common";

@Injectable()
export class FileValidation implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        let oneKb = 100000;
        if (value.size > oneKb) {
            throw new BadRequestException("too large file");
        }
        return value;
    }
}
