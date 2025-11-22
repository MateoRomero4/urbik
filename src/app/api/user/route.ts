import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';
import { authOptions, ExtendedSession } from '../auth/[...nextauth]/route'; 
import { getServerUserProfile, updateServerProfile } from '../../../features/profile/service/profileService'; 


interface UserProfile {
  name: string;
  lastName: string;
  phone: string;
}

type ProfileUpdatePayload = Partial<UserProfile>;


function handleServiceError(err: Error, status: number = 500): Response {
  console.error("Error en el servicio de perfil:", err.message);
  
  const responseBody = {
    error: err.message || 'Error interno del servidor',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
  };

  return new Response(JSON.stringify(responseBody), { status });
}

export async function GET(req: NextRequest): Promise<Response> {

  const session = await getServerSession(authOptions) as ExtendedSession | null; 
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return new Response(JSON.stringify({ error: 'No hay email en sesión' }), { status: 400 });
  }

  try {
    const responseData: UserProfile = await getServerUserProfile(email);
    
    return new Response(JSON.stringify(responseData), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const error = err as Error;

    if (error.message === 'Usuario no encontrado') {
      return handleServiceError(error, 404);
    }
    return handleServiceError(error, 500);
  }
}

export async function PUT(req: NextRequest): Promise<Response> {
  const session = await getServerSession(authOptions) as ExtendedSession | null;

  if (!session) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const email = session.user?.email;
  if (!email) {
    return new Response(JSON.stringify({ error: 'No hay email en sesión' }), { status: 400 });
  }

  try {
    const body: ProfileUpdatePayload = await req.json();
    
    const updatedData: UserProfile = await updateServerProfile(email, body);
    
    return new Response(JSON.stringify({ message: 'Perfil actualizado', updated: updatedData }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const error = err as Error;

    if (error.message.includes('requerido') || error.message.includes('no soportado')) {
      return handleServiceError(error, 400);
    }
    if (error.message === 'Usuario no encontrado') {
        return handleServiceError(error, 404);
    }
    return handleServiceError(error, 500);
  }
}