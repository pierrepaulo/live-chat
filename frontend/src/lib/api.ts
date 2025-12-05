import type { CreateUserPayload, Message, User } from "../types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3333";

type ApiError = {
  message: string;
  status?: number;
};

const parseError = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") {
      return { message: data.message, status: response.status };
    }
    if (Array.isArray(data?.errors)) {
      return { message: "Validation failed", status: response.status };
    }
  } catch {}
  return {
    message: `Request failed (${response.status})`,
    status: response.status,
  };
};

const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseError(res);
  }
  return res.json();
};

const fetchMessages = async (limit = 50): Promise<Message[]> => {
  const res = await fetch(`${API_BASE_URL}/messages?limit=${limit}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseError(res);
  }
  return res.json();
};

export { API_BASE_URL, createUser, fetchMessages };
