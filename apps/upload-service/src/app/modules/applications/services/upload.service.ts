import { Inject, Injectable } from '@nestjs/common';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { S3_CLIENT } from '@common/configuration/s3.config';

@Injectable()
export class UploadService {
  constructor(
    @Inject(S3_CLIENT)
    private readonly s3: S3Client,

    private readonly configService: ConfigService,
  ) {}

  async singleUpload(file: Express.Multer.File): Promise<{ url: string; key: string }> {
    const bucketName = this.configService.getOrThrow<string>('S3_CONFIG.AWS_S3_BUCKET');
    const region = this.configService.getOrThrow<string>('S3_CONFIG.S3_CLIENT_CONFIG.region');

    const resizedBuffer = await sharp(file.buffer)
      .resize({ width: 900, height: 900, fit: 'cover', position: 'center' })
      .webp({ quality: 75 })
      .toBuffer();

    const id = uuidv4();
    const key = `uploads/${id}-${file.originalname.split('.')[0]}.webp`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: resizedBuffer,
        ContentType: 'image/webp',
        ACL: ObjectCannedACL.public_read,
      }),
    );

    return {
      key,
      url: this.getPublicUrl(bucketName, region, key),
    };
  }

  private getPublicUrl(bucketName: string, region: string, key: string): string {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }
}
