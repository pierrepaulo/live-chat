import { io, type Socket } from 'socket.io-client';
import type { CreateMessagePayload, Message, SocketStatus } from '../types/chat';
import { API_BASE_URL } from './api';

type SocketHandlers = {
  onMessage: (message: Message) => void;
  onError: (error: string) => void;
  onStatusChange?: (status: SocketStatus) => void;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL?.replace(/\/$/, '') ?? API_BASE_URL ?? 'http://localhost:3333';

type ChatSocket = Socket & { emitMessage: (payload: CreateMessagePayload) => void };

const createChatSocket = ({ onMessage, onError, onStatusChange }: SocketHandlers): ChatSocket => {
  onStatusChange?.('connecting');
  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
  });

  socket.on('connect', () => {
    onStatusChange?.('connected');
  });

  socket.on('disconnect', () => {
    onStatusChange?.('disconnected');
  });

  socket.on('chat:message', onMessage);

  socket.on('chat:error', (payload: { message?: string }) => {
    onError(payload?.message ?? 'Chat error');
  });

  socket.on('connect_error', () => {
    onStatusChange?.('disconnected');
    onError('Unable to connect to chat');
  });

  const emitMessage = (payload: CreateMessagePayload) => {
    socket.emit('chat:message', payload);
  };

  return Object.assign(socket, { emitMessage });
};

export { createChatSocket, SOCKET_URL };
