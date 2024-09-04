import { Expose } from 'class-transformer';

export class InstagramProfileDto {
  @Expose({ name: 'followers_count' })
  followersCount: string;

  @Expose({ name: 'follows_count' })
  followsCount: string;

  @Expose({ name: 'media_count' })
  mediaCount: string;

  @Expose()
  username: string;
}
