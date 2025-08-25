import { Global, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { MulterModule } from '@nestjs/platform-express';

@Global()
@Module({
  imports: [MulterModule.register({})],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule { }
