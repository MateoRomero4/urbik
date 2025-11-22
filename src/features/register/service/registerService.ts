import { hash } from "bcryptjs";
import prisma from '@/core/libs/prisma.server'; 


export async function registerUserAndAgency({ name, email, password, role }) {
  
  if (!role || (role !== 'User' && role !== 'RealEstateAgency')) {
    throw new Error("Tipo de cuenta no válido. Debe ser 'User' o 'RealEstateAgency'.");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }

  const hashed = await hash(password, 10);
  
  const userRole = role === 'RealEstateAgency' ? 'REALSTATE' : 'USER';

  const result = await prisma.$transaction(async (prismaTransaction) => {
    const user = await prismaTransaction.user.create({
      data: { name, email, password: hashed, role: userRole },
    });
    
    let realEstateAgency = null;

    if (role === 'RealEstateAgency') {
      realEstateAgency = await prismaTransaction.realEstateAgency.create({
        data: {
          name: user.name, 
          email: user.email, 
          password: hashed, 
          userId: user.id, 
        },
      });
    }
    
    return { user, realEstateAgency };
  });

  const { password: _, ...userWithoutPassword } = result.user;
  return userWithoutPassword;
}