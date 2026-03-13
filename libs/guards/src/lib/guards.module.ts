import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OwnerGuard } from './owner.guard';
import { PermissionGuard } from './permission.guard';

@Module({
  imports: [JwtModule],
  providers: [JwtAuthGuard, OwnerGuard, PermissionGuard],
  exports: [JwtAuthGuard, OwnerGuard, PermissionGuard],
})
export class GuardsModule {}
