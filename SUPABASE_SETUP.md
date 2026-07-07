# Supabase Setup for MIC IN Live Chat

## 1. Create a Supabase project

Go to [https://supabase.com](https://supabase.com) and create a free project.

## 2. Run this SQL in the Supabase SQL Editor

```sql
-- Create the messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  avatar text not null default '🎤',
  message text not null,
  color text not null default 'text-pablo-orange',
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.messages enable row level security;

-- Allow anyone to read messages
create policy "Anyone can read messages"
  on public.messages for select using (true);

-- Allow anyone to insert messages
create policy "Anyone can insert messages"
  on public.messages for insert with check (true);

-- Enable Realtime on the messages table
alter publication supabase_realtime add table public.messages;
```

## 3. Get your API keys

In your Supabase dashboard, go to **Settings → API** and copy:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

## 4. Create a `.env` file

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUz...your-key
```

## 5. Run the app

```bash
npm run dev
```

Open the app in multiple browser tabs to see real-time chat in action!

## Features

- **Real-time messages** — uses Supabase Postgres Changes (INSERT) to stream new messages to all connected clients instantly
- **Persistent history** — all messages are stored in Postgres and loaded on page refresh
- **Typing indicator** — uses Supabase Broadcast (no DB hit) to show who's typing
- **Online count** — uses Supabase Presence to track connected users
- **Usernames** — stored in localStorage, required before chatting
- **Auto-scroll** — smart scroll that only auto-scrolls if user is near the bottom
- **Timestamps** — relative timestamps (just now, 5s ago, 3m ago, 2h ago)
