import { forwardRef, Global, Module } from "@nestjs/common";
import { AuthGuard } from './auth.guard';
import { UserModule } from '../user/user.module';
import { ProductGuard } from "./product.guard";

@Global()
@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthGuard, ProductGuard],
  exports: [AuthGuard, ProductGuard],
})
export class AuthModule {}
