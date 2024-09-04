import { Expose } from 'class-transformer';

export class InstagramPostDto {
  @Expose({ name: 'media_url' })
  mediaUrl: string;

  @Expose({ name: 'thumbnail_url' })
  thumbnailUrl: string;

  @Expose()
  id: string;

  @Expose()
  caption: string;
}
