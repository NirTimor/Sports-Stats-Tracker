import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const teamId = searchParams.get('teamId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (userId) where.userId = userId;
    if (teamId) where.teamId = teamId;
    if (isActive !== null) where.isActive = isActive === 'true';

    const players = await prisma.player.findMany({
      where,
      include: {
        team: true,
        stats: {
          include: {
            match: true,
          },
        },
      },
    });
    return NextResponse.json(players);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const player = await prisma.player.create({
      data: {
        name: body.name,
        position: body.position,
        number: body.number,
        userId: body.userId,
        teamId: body.teamId,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, position, number, teamId, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    const player = await prisma.player.update({
      where: { id },
      data: {
        name,
        position,
        number,
        teamId,
        isActive,
      },
    });
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      );
    }

    await prisma.player.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
} 