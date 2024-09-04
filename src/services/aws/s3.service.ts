import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  getS3() {
    return new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION') || 'us-east-2',
      signatureVersion: 'v4',
    });
  }

  public async getSignedUrl(
    userId: string,
    mimetype: string,
    folderPath: string,
  ) {
    const key = `${userId}-${new Date().getTime()}`;
    return await this.getPresignedUrl(key, mimetype, folderPath);
  }

  public async getPresignedUrl(
    key: string,
    mimetype: string,
    folderPath: string,
  ) {
    const s3 = this.getS3();

    const filetype: string = mimetype.split('/')[1];
    const fileName = `${folderPath}/${key}.${filetype}`;
    const s3Url = `${process.env.AWS_S3_BUCKET_URL}/${fileName}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Expires: 3600,
      ContentType: mimetype,
      ACL: 'public-read',
    };

    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);

    return {
      s3Url,
      uploadUrl,
    };
  }
}
