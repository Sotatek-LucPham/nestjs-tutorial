import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";


@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToInstance(metatype, value, {
            enableImplicitConversion: true,
        });
        const errors = await validate(object);
        if (errors.length > 0) {
            const messages = errors.map(err => {
                const constraints = err.constraints
                    ? Object.values(err.constraints)
                    : [];
                return `${err.property}: ${constraints.join(', ')}`;
            });
            throw new BadRequestException(messages);
        }
        return object;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

}
