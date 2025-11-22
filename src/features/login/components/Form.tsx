import { useLogin } from '../hooks/useLogin';
import Link from 'next/link';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginForm() {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    handleLogin, 
    handleGoogleSignIn, 
    errorMessage, 
    isLoading 
  } = useLogin();

  return (
    <div className="w-full md:w-2/5 lg:w-2/5 p-8 md:p-10 flex flex-col justify-center h-full"> 
      <div className="mb-8 text-center md:text-left ml-5">
        <h2 className="text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
        <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder</p>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-full relative mb-6 mx-5" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-6 mx-5">
        <div>
          <label htmlFor="email" className="ml-5 block text-sm font-semibold text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 shadow-sm"
            required
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="ml-5 block text-sm font-semibold text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-200 shadow-sm"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="ml-5 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="remember" className="ml-2 block text-gray-700">
              Recordarme
            </label>
          </div>
          <Link href="/forgot-password" className="mr-5 font-medium text-sky-500 hover:text-sky-700 transition duration-150">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-full font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-lg ${
            isLoading 
              ? 'bg-sky-300 text-white cursor-not-allowed' 
              : 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700'
          }`}
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      
      <div className="mt-6 mx-5">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition duration-200"
          >
            <GoogleIcon />
            Google
          </button>
        </div>
      </div>
      <div className="mt-8 text-center text-sm text-gray-600 mx-5">
        ¿No tienes una cuenta?
        <Link href="/register" className="ml-1 font-medium text-sky-500 hover:text-sky-700 transition duration-150">
          Regístrate
        </Link>
      </div>
    </div>
  );
}