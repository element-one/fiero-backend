import { UserEntity } from '@entities/user.entity';
import { UserSocialEntity } from '@entities/user-social.entity';
import { SocialNotLinkedException } from '@exceptions/social-not-linked';

export const getTwitterUser = async (
  user: UserEntity,
): Promise<UserSocialEntity> => {
  const userTwitter = user.socials.find(
    (social) => social.type === 'twitter' && social.isVerified === true,
  );

  if (!userTwitter) {
    throw new SocialNotLinkedException();
  }

  return userTwitter;
};

export const getInstagramUser = async (
  user: UserEntity,
): Promise<UserSocialEntity> => {
  const userInstagram = user.socials.find(
    (social) => social.type === 'instagram' && social.isVerified === true,
  );

  if (!userInstagram) {
    throw new SocialNotLinkedException();
  }

  return userInstagram;
};

export const getTikTokUser = async (
  user: UserEntity,
): Promise<UserSocialEntity> => {
  const userTikTok = user.socials.find(
    (social) => social.type === 'tiktok' && social.isVerified === true,
  );

  if (!userTikTok) {
    throw new SocialNotLinkedException();
  }

  return userTikTok;
};

export const findHashtag = (text: string): string => {
  const regexp = /\B\#\w\w+\b/g;
  const result = text.match(regexp);
  if (result) {
    return result[0];
  } else {
    return '';
  }
};
