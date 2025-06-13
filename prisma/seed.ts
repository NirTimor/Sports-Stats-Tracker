import { PrismaClient, Sport } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  // Create some teams
  const soccerTeam = await prisma.team.create({
    data: {
      name: 'Red Dragons',
      sport: Sport.SOCCER,
      userId: user.id,
    },
  });

  const basketballTeam = await prisma.team.create({
    data: {
      name: 'Blue Eagles',
      sport: Sport.BASKETBALL,
      userId: user.id,
    },
  });

  // Create some players
  const soccerPlayers = await Promise.all([
    prisma.player.create({
      data: {
        name: 'John Smith',
        position: 'Forward',
        number: 10,
        userId: user.id,
        teamId: soccerTeam.id,
      },
    }),
    prisma.player.create({
      data: {
        name: 'Mike Johnson',
        position: 'Midfielder',
        number: 8,
        userId: user.id,
        teamId: soccerTeam.id,
      },
    }),
  ]);

  const basketballPlayers = await Promise.all([
    prisma.player.create({
      data: {
        name: 'David Wilson',
        position: 'Point Guard',
        number: 3,
        userId: user.id,
        teamId: basketballTeam.id,
      },
    }),
    prisma.player.create({
      data: {
        name: 'James Brown',
        position: 'Center',
        number: 33,
        userId: user.id,
        teamId: basketballTeam.id,
      },
    }),
  ]);

  // Create a match
  const match = await prisma.match.create({
    data: {
      date: new Date(),
      homeTeamId: soccerTeam.id,
      awayTeamId: basketballTeam.id,
      location: 'Main Stadium',
      status: 'COMPLETED',
      homeScore: 2,
      awayScore: 1,
    },
  });

  // Add some stats
  await Promise.all([
    prisma.stat.create({
      data: {
        type: 'GOALS',
        value: 2,
        playerId: soccerPlayers[0].id,
        matchId: match.id,
      },
    }),
    prisma.stat.create({
      data: {
        type: 'ASSISTS',
        value: 1,
        playerId: soccerPlayers[1].id,
        matchId: match.id,
      },
    }),
  ]);

  // Add team stats
  await Promise.all([
    prisma.teamStat.create({
      data: {
        type: 'POSSESSION',
        value: 60,
        teamId: soccerTeam.id,
        matchId: match.id,
      },
    }),
    prisma.teamStat.create({
      data: {
        type: 'CORNERS',
        value: 8,
        teamId: soccerTeam.id,
        matchId: match.id,
      },
    }),
  ]);

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 