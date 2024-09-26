Work in progress

This is my own take on a Nextjs starter repo.

I'm building a lot of things as a side project. I'm tired of doing the same thing over and over again.

This would be a full-stack Nextjs repo.

What we have here:

- Nextjs 14 with App Router
- Drizzle ORM for Postrges
- Tanstack React Query
- Lucia Auth with Google OAuth
- Basic POST and GET endpoint (todo)
- Hooks for data fetching (todo)

Maybe I'll add these in the future:

- Payment

## How to start

- Clone the project
- pnpm i
- pnpm dev
- get yourself a postgres db and google oauth credentials (see .env.example)
- Mess around

## The DB stuff

- get a postgres db, wherever you prefer
- pass the connection string to the .env file
- pnpm drizzle-kit migrate
