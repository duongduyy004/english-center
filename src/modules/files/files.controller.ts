import { Controller, Delete, Param, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FilesService } from "./files.service";
import { Public } from "@/decorator/customize.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) { }

    @Public()
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.uploadFile(file, 'test')
    }

    @Public()
    @Delete()
    delete(@Query('publicId') publicId: string) {
        return this.filesService.deleteFile(publicId)
    }
}