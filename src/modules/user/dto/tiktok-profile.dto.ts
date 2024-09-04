import { Expose } from 'class-transformer';

export class TikTokProfileDto {
  @Expose({ name: 'follower_count' })
  followersCount: string;

  @Expose({ name: 'following_count' })
  followsCount: string;

  @Expose({ name: 'video_count' })
  mediaCount: string;

  @Expose()
  username?: string;
}
