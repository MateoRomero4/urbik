import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        role: 'REALSTATE',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 5,
    });

    const realStateUsers = users.map(user => ({
      type: 'REALSTATE_USER',
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    return NextResponse.json({ users: realStateUsers });
  } catch (error) {
    console.error('Error fetching REALSTATE users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}