import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// prisma.module.ts
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
