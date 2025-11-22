import { signIn } from 'next-auth/react';

interface LoginResponse {
  ok: boolean;
  error: string | undefined;
  status: number;
  url: string | null;
}

export const authService = {

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return result as LoginResponse;
  },

  signInWithGoogle: (callbackUrl: string = '/') => {
    signIn('google', { callbackUrl });
  }
};