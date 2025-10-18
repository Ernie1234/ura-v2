
export type loginType = { email: string; password: string };
export type LoginResponseType = {
  status: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    currentWorkspace: string;
  };
};

export type registerType = {
  name: string;
  email: string;
  password: string;
};

// USER TYPE
export type UserType = {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isActive: true;
  lastLogin: null;
  createdAt: Date;
  updatedAt: Date;
  currentWorkspace: {
    _id: string;
    name: string;
    owner: string;
    inviteCode: string;
  };
};

export type CurrentUserResponseType = {
  message: string;
  user: UserType;
};