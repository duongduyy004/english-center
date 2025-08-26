import { Global, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';

@Global()
@Module({
  imports: [MulterModule.register({})],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule { }
