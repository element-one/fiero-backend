type JSONArray = Array<JSONValue>;

type JSONValue = string | number | boolean | JSONObject | JSONArray;

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JwtPayload {
  email: string;
}

export interface RawBodyRequest extends Request {
  body: any;
  rawBody: Buffer;
}

export interface ContentTwitterLike {
  twitterId: string;
  twitterName: string;
}

export interface ContentTwitterReply {
  twitterId: string;
  twitterName: string;
}

export interface ContentTwitterRetweet {
  twitterId: string;
  twitterName: string;
}

export interface ContentTwitterFollow {
  twitterUsername: string;
  twitterName: string;
}

export interface GoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  referral?: string;
  ip?: string;
}
