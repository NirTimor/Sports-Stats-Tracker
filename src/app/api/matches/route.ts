import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const homeTeamId = searchParams.get('homeTeamId');
    const awayTeamId = searchParams.get('awayTeamId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};
    if (homeTeamId) where.homeTeamId = homeTeamId;
    if (awayTeamId) where.awayTeamId = awayTeamId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        stats: {
          include: {
            player: true,
          },
        },
        teamStats: {
          include: {
            team: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const match = await prisma.match.create({
      data: {
        date: new Date(body.date),
        homeTeamId: body.homeTeamId,
        awayTeamId: body.awayTeamId,
        location: body.location,
        homeScore: body.homeScore,
        awayScore: body.awayScore,
        status: body.status,
      },
    });
    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, date, homeTeamId, awayTeamId, location, homeScore, awayScore, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    const match = await prisma.match.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        homeTeamId,
        awayTeamId,
        location,
        homeScore,
        awayScore,
        status,
      },
    });
    return NextResponse.json(match);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update match' },
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
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }

    await prisma.match.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    );
  }
} 