import { BadRequestException, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });
    if (error) {
      throw new BadRequestException(
        error.details.map((d) => d.message).join(', '),
      );
    }
    return value;
  }
}
