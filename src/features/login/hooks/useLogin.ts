import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../service/authService';

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await authService.login(email, password);
      
      if (result.ok) {
        router.push("/");
      } else {
        setErrorMessage("Credenciales incorrectas. Verifica tu email y contraseña.");
      }
    } catch (error) {
      console.error("Fallo inesperado al iniciar sesión:", error);
      setErrorMessage("Ocurrió un error inesperado al intentar iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);

  const handleGoogleSignIn = useCallback(() => {
    authService.signInWithGoogle('/');
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleGoogleSignIn,
    errorMessage,
    isLoading
  };
};