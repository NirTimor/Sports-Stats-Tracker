import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { matchId, stats } = body;

    // Validate the match exists and belongs to the user
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { homeTeam: { userId: session.user.email } },
          { awayTeam: { userId: session.user.email } }
        ]
      }
    });

    if (!match) {
      return new NextResponse('Match not found', { status: 404 });
    }

    // Save the stats
    const soccerStats = await prisma.soccerStats.upsert({
      where: { matchId },
      update: {
        homeGoals: stats.homeTeam.goals,
        homePossession: stats.homeTeam.possession,
        homeShots: stats.homeTeam.shots,
        homeShotsOnTarget: stats.homeTeam.shotsOnTarget,
        awayGoals: stats.awayTeam.goals,
        awayPossession: stats.awayTeam.possession,
        awayShots: stats.awayTeam.shots,
        awayShotsOnTarget: stats.awayTeam.shotsOnTarget,
      },
      create: {
        matchId,
        homeGoals: stats.homeTeam.goals,
        homePossession: stats.homeTeam.possession,
        homeShots: stats.homeTeam.shots,
        homeShotsOnTarget: stats.homeTeam.shotsOnTarget,
        awayGoals: stats.awayTeam.goals,
        awayPossession: stats.awayTeam.possession,
        awayShots: stats.awayTeam.shots,
        awayShotsOnTarget: stats.awayTeam.shotsOnTarget,
      }
    });

    return NextResponse.json(soccerStats);
  } catch (error) {
    console.error('Error saving soccer stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return new NextResponse('Match ID is required', { status: 400 });
    }

    const stats = await prisma.soccerStats.findUnique({
      where: { matchId }
    });

    if (!stats) {
      return new NextResponse('Stats not found', { status: 404 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching soccer stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 