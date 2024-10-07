export type post = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    phone: string;
    address: { country: string; state: string };
    avatar: string;
  };
};

export type user = {
  username: string;
  phone: string;
  address: { country: string; state: string };
  avatar: string;
  birthday?: string;
};

export type comment = {
  id: string;
  comment: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    username: string;
    phone: string;
    address: { country: string; state: string };
    avatar: string;
  };
};
