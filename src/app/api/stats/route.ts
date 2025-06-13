import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const playerId = searchParams.get('playerId');
    const teamId = searchParams.get('teamId');

    if (matchId) {
      const stats = await prisma.stat.findMany({
        where: { matchId },
        include: { player: true },
      });
      const teamStats = await prisma.teamStat.findMany({
        where: { matchId },
        include: { team: true },
      });
      return NextResponse.json({ playerStats: stats, teamStats });
    }

    if (playerId) {
      const stats = await prisma.stat.findMany({
        where: { playerId },
        include: { match: true },
      });
      return NextResponse.json(stats);
    }

    if (teamId) {
      const teamStats = await prisma.teamStat.findMany({
        where: { teamId },
        include: { match: true },
      });
      return NextResponse.json(teamStats);
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, value, playerId, matchId, teamId } = body;

    if (playerId && matchId) {
      const stat = await prisma.stat.create({
        data: {
          type,
          value,
          playerId,
          matchId,
        },
      });
      return NextResponse.json(stat);
    }

    if (teamId && matchId) {
      const teamStat = await prisma.teamStat.create({
        data: {
          type,
          value,
          teamId,
          matchId,
        },
      });
      return NextResponse.json(teamStat);
    }

    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create stat' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, value, type } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing stat ID' }, { status: 400 });
    }

    // Try to update player stat first
    try {
      const stat = await prisma.stat.update({
        where: { id },
        data: { value, type },
      });
      return NextResponse.json(stat);
    } catch {
      // If not found, try to update team stat
      const teamStat = await prisma.teamStat.update({
        where: { id },
        data: { value, type },
      });
      return NextResponse.json(teamStat);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stat' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing stat ID' }, { status: 400 });
    }

    // Try to delete player stat first
    try {
      await prisma.stat.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    } catch {
      // If not found, try to delete team stat
      await prisma.teamStat.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete stat' }, { status: 500 });
  }
} 