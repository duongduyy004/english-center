import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Public } from "@/decorator/customize.decorator";

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) { }

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.upload(file, 'aws-test')
  }

  @Get('')
  @Public()
  async getSignedUrl(@Query('key') key: string) {
    return await this.filesService.getFileUrl(key);
  }

  @Delete('')
  async delete(@Query('key') key: string) {
    return this.filesService.deleteFile(key);
  }
}