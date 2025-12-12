export type loginType = { email: string; password: string };

export type LoginResponseType = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      businessName?: string;
    };
  };
};

export type RegisterResponseType = {
  success: boolean;
  message: string;
};

export type registerType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// USER TYPE - matches backend IUser model
export type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
  businessName?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastLoginAt?: Date;
  bookmarkedBusinesses: string[];
  bookmarkedPosts: string[];
  savedEvents: string[];
  followingUsers: string[];
  followingBusinesses: string[];
  followers: string[];
  businesses: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type RelatedData = {
  businesses: Array<{
    _id: string;
    businessName: string;
    profileImage?: string;
    coverImage?: string;
    followers?: string[];
    likes?: string[];
    category?: string;
  }>;
  recentPosts: Array<{
    _id: string;
    business: string;
    name: string;
    description: string;
    itemNumber?: string;
    price: number;
    media?: string[];
    tags?: string[];
    likes?: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  counts: {
    posts: number;
    followers: number;
    following: number;
  };
};

export type CurrentUserResponseType = {
  success: boolean;
  message: string;
  user: UserType;
  related?: RelatedData;
};

