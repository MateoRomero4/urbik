import prisma from '@/libs/db';
import { 
  RealStateFormFields, 
  UserFormFields 
} from "../../../libs/types";

export async function fetchProfileData() {
  const res = await fetch("/api/user");
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al cargar datos del usuario");
  }
  
  return res.json(); 
}

export async function updateProfile(
  payload: RealStateFormFields | UserFormFields, 
  userRole: 'USER' | 'REALSTATE'
) {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || "Error al actualizar perfil");
  }

  return data;
}

export async function getServerUserProfile(email: string) {
  const user = await prisma.user.findUnique({ 
    where: { email },
    include: {
      realEstateAgencies: {
        include: { properties: true }
      },
      properties: true,
    }
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const { password, ...userSafe } = user;
  
  const responseData = {
    ...userSafe,
    agencyData: user.role === 'REALSTATE' ? user.realEstateAgencies[0] : null,
  };
  
  return responseData;
}

export async function updateServerProfile(email: string, body: any) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  
  let updatedData;

  if (user.role === 'USER') {
    const { firstName, lastName, phone } = body;
    
    if (!firstName || !lastName) {
      throw new Error('Nombre y apellido requeridos');
    }

    updatedData = await prisma.user.update({
      where: { email },
      data: { firstName, lastName, phone },
    });
  
  } else if (user.role === 'REALSTATE') {
    const { name, address, phone, website } = body;
    
    if (!name) {
      throw new Error('El nombre de la inmobiliaria es requerido');
    }
    
    await prisma.$transaction(async (prismaTransaction) => {
      await prismaTransaction.realEstateAgency.update({
        where: { userId: user.id },
        data: { name, address, phone, website },
      });
      
      updatedData = await prismaTransaction.user.update({
        where: { id: user.id },
        data: { name },
      });
    });
    
    updatedData = { message: 'Agencia y perfil de usuario actualizados', user: updatedData };

  } else {
    throw new Error('Rol de usuario no soportado para actualización');
  }
  
  return updatedData;
}