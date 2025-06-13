# Sports Stats Tracker

A modern web application for tracking and analyzing sports statistics across multiple sports (Soccer, Basketball, and Tennis).

## Features

- Track teams and players across different sports
- Record match results and individual player statistics
- Beautiful and responsive UI built with Tailwind CSS
- Real-time data updates
- Modern tech stack with Next.js and TypeScript

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- React Query
- Chart.js for data visualization

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd sports-stats-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory and add:
```
DATABASE_URL="postgresql://user:password@localhost:5432/sports_stats"
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── teams/          # Teams page
│   ├── players/        # Players page
│   └── matches/        # Matches page
├── components/         # Reusable components
├── lib/               # Utility functions and configurations
└── types/             # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
