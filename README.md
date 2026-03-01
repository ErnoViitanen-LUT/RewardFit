# RewardFit

A PWA for logging workouts, tracking milestones, and earning rewards. Works on iPhone + Mac with auto-sync via Supabase Realtime.

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon public key** from Settings → API

### 2. Run the database schema

1. Go to the **SQL Editor** in your Supabase dashboard
2. Paste and run `supabase/schema.sql`
3. Then paste and run `supabase/rls.sql`

### 3. Enable Realtime

1. Go to **Database → Replication** in Supabase
2. Under "Supabase Realtime", ensure the `workouts`, `milestones`, and `rewards` tables have realtime enabled
3. The `schema.sql` script does this automatically, but verify in the UI

### 4. Enable Auth (Magic Link)

1. Go to **Authentication → Providers** in Supabase
2. Ensure **Email** provider is enabled
3. Magic link (OTP) is enabled by default

### 5. Set environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 6. Run locally

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

1. Push your code to a GitHub repo
2. Go to [Cloudflare Pages](https://pages.cloudflare.com)
3. Connect your GitHub repo
4. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

### Add to Home Screen (iPhone)

1. Open the deployed URL in Safari
2. Tap the **Share** button
3. Tap **Add to Home Screen**
4. The app opens fullscreen from the icon

## Milestone rules

- **TOTAL_WORKOUTS**: Counts all workouts since start date. Unlocks when count reaches target.
- **WORKOUTS_PER_WEEK**: Uses Mon-Sun week buckets. Requires target workouts each week for N consecutive weeks.
