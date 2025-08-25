import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@/config/config.type';
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService implements OnModuleInit {
  private s3Client: S3Client;
  private bucket: string;
  constructor(private configService: ConfigService<AllConfigType>) { }

  async onModuleInit() {
    this.bucket = this.configService.get('aws.bucketName', { infer: true })
    this.s3Client = new S3Client({
      region: this.configService.get('aws.region', { infer: true }),
      endpoint: this.configService.get('minio.endpoint', { infer: true }),
      credentials: {
        accessKeyId: this.configService.get('aws.accessKeyId', { infer: true }),
        secretAccessKey: this.configService.get('aws.secretAccessKey', { infer: true })
      },
      forcePathStyle: true
    })

  }

  async upload(file: Express.Multer.File, path: string = '') {
    try {
      const fileName = path ? `${path}/${Date.now()}-${file.originalname}` : `${Date.now()}-${file.originalname}`;
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype
      }))
      return fileName;
    } catch (error) {
      console.log(error)
    }
  }

  async getFileUrl(fileName: string) {
    if (!await this.fileExists(fileName)) throw new NotFoundException(`File not found: ${fileName}`);
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: fileName
    })

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 1 * 60 * 60
    })
  }

  async deleteFile(fileName: string) {
    if (!await this.fileExists(fileName)) throw new NotFoundException(`File not found: ${fileName}`);
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: fileName
        })
      )

      return { deleted: true }
    } catch (error) {
      console.error('Error deleting file:', error);
      return { deleted: false };
    }
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true; // File exists ✅
    } catch (error) {
      if (error.$metadata?.httpStatusCode === 404) {
        return false; // File not found ❌
      }
      throw error; // Other errors
    }
  }

}
