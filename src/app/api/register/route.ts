import { NextResponse, NextRequest } from 'next/server';
import { registerUserAndAgency } from '../../../features/register/services/registerService.ts';

interface RegisterData {
  email: string;
  password?: string;
  agencyName: string;
  accountType: 'user' | 'agency'; 
}

interface RegisteredUser {
  id: string;
  email: string;
  agencyId: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const data: RegisterData = await req.json();

    const user: RegisteredUser = await registerUserAndAgency(data);

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error("Error en el Route Handler de registro:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
    
    const status = (errorMessage.includes('correo ya está registrado') || errorMessage.includes('Tipo de cuenta no válido')) ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage || "Error interno del servidor." },
      { status }
    );
  }
}