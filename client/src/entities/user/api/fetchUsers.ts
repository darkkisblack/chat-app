import type { User } from '../model/useUserStore';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};
