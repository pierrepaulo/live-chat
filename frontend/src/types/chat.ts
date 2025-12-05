type User = {
  id: string;
  name: string;
  createdAt: string;
};

type Message = {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: User;
};

type CreateUserPayload = { name: string };
type CreateMessagePayload = { content: string; userId: string };
type SocketStatus = 'connecting' | 'connected' | 'disconnected';

export type { User, Message, CreateUserPayload, CreateMessagePayload, SocketStatus };
