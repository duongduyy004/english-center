import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class FilesService implements OnModuleInit {
  constructor(private configService: ConfigService<AllConfigType>) { }

  onModuleInit() {
    cloudinary.config({
      api_key: this.configService.get('cloudinary.apiKey', { infer: true }),
      api_secret: this.configService.get('cloudinary.apiSecret', { infer: true }),
      cloud_name: this.configService.get('cloudinary.cloudName', { infer: true }),
      secure: this.configService.get('cloudinary.secure', { infer: true }) ?? true,
    })
  }

  async uploadFile(file: Express.Multer.File, path: string = '') {
    try {
      // Upload the image
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: path,
          filename_override: `${Date.now()}-${file.originalname}`,
          use_filename: true
        }, (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        }).end(file.buffer);
      });
      return uploadResult;
    } catch (error) {
      console.error(error);
    }
  }

}
