// src/features/profile/service/profileService.ts
import prisma from "@/libs/db";
import type { Prisma } from "@prisma/client";
import { RealStateFormFields, UserFormFields } from "../../../libs/types";

export async function fetchProfileData() {
  const res = await fetch("/api/user");

  if (!res.ok) {
    const errorData: { error?: string } = await res.json();
    throw new Error(errorData.error || "Error al cargar datos del usuario");
  }

  return res.json();
}

export async function updateProfile(
  payload: RealStateFormFields | UserFormFields,
  _userRole: "USER" | "REALSTATE" // lo dejo por compatibilidad, pero no se usa acá
) {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: { error?: string } = await res.json();

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
        include: { properties: true },
      },
      properties: true,
    },
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // sacamos password por seguridad
  const { password: _password, ...userSafe } = user;

  const responseData = {
    ...userSafe,
    agencyData: user.role === "REALSTATE" ? user.realEstateAgencies[0] : null,
  };

  return responseData;
}

type UpdateServerProfileBody = {
  // para USER
  firstName?: string;
  lastName?: string;
  phone?: string;

  // para REALSTATE
  name?: string;
  address?: string;
  website?: string;
};

export async function updateServerProfile(
  email: string,
  body: UpdateServerProfileBody
) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  if (user.role === "USER") {
    const { firstName, lastName, phone } = body;

    if (!firstName || !lastName) {
      throw new Error("Nombre y apellido requeridos");
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { firstName, lastName, phone },
    });

    return updatedUser;
  }

  if (user.role === "REALSTATE") {
    const { name, address, phone, website } = body;

    if (!name) {
      throw new Error("El nombre de la inmobiliaria es requerido");
    }

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const agency = await tx.realEstateAgency.findFirst({
          where: { userId: user.id },
        });

        if (!agency) {
          throw new Error("Agencia no encontrada para este usuario");
        }

        await tx.realEstateAgency.update({
          where: { id: agency.id }, // ✅ update solo con unique
          data: { name, address, phone, website },
        });

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: { name },
        });

        return updatedUser;
      }
    );

    return {
      message: "Agencia y perfil de usuario actualizados",
      user: result,
    };
  }

  throw new Error("Rol de usuario no soportado para actualización");
}
