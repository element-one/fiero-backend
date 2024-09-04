import { Expose } from 'class-transformer';

export class TikTokPostDto {
  @Expose({ name: 'embed_link' })
  mediaUrl: string;

  @Expose({ name: 'cover_image_url' })
  thumbnailUrl: string;

  @Expose()
  id: string;

  @Expose({ name: 'title' })
  caption: string;

  @Expose({ name: 'video_description' })
  description: string;
}
