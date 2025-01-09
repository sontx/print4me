import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: { details?: boolean }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // Assuming the user is attached to the request by your auth guard
    return user; // Return the basic user object if `details` is not requested
  },
);
