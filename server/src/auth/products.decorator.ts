
import { Reflector } from '@nestjs/core';

export const Products = Reflector.createDecorator<string[]>();
