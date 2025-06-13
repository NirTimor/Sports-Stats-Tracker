import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sport = searchParams.get('sport');

    const where: any = {};
    if (userId) where.userId = userId;
    if (sport) where.sport = sport;

    const teams = await prisma.team.findMany({
      where,
      include: {
        players: true,
        homeMatches: {
          include: {
            awayTeam: true,
            stats: true,
            teamStats: true,
          },
        },
        awayMatches: {
          include: {
            homeTeam: true,
            stats: true,
            teamStats: true,
          },
        },
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const team = await prisma.team.create({
      data: {
        name: body.name,
        sport: body.sport,
        userId: body.userId, // In a real app, this would come from the authenticated user
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, sport } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    const team = await prisma.team.update({
      where: { id },
      data: {
        name,
        sport,
      },
    });
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update team' },
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
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }

    await prisma.team.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 }
    );
  }
} 