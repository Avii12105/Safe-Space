# Safe Space - Your AI Environmental Guardian 🌍

A real-time environmental health monitoring app that uses AI to keep you safe from air pollution, noise, and weather hazards.

## ✨ Features

- 🌡️ **Real-Time Weather Data** - Live temperature, humidity, and conditions
- 🏭 **Air Quality Monitoring** - Real AQI from OpenWeatherMap/OpenAQ APIs
- 🔊 **Noise Level Tracking** - Time-based noise simulation
- 🤖 **AI-Powered Analysis** - Gemini AI evaluates your environmental risk
- 📊 **Historical Trends** - 7-day charts for AQI and noise
- 💊 **Health Check-ins** - Track your mood vs environment
- 🎯 **Personalized Recommendations** - AI-generated safety tips
- ⚙️ **Customizable Settings** - Set your own safety thresholds
- 📍 **Geolocation Support** - Automatic location detection

## 🚀 Quick Start

**Prerequisites:** Node.js 16+

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env`
   - Add your API keys:
     ```env
     VITE_API_KEY=your_gemini_api_key
     VITE_WEATHER_API_KEY=your_openweathermap_key
     VITE_SUPABASE_URL=https://llmrmokanfdilgbmjjhl.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbXJtb2thbmZkaWxnYm1qamhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzk5NzUsImV4cCI6MjA3OTkxNTk3NX0.HNLFiwP74toQTOnkZ0hoKaprSLZq1Fm4GMkbylLX-6I
     ```

3. **Get your FREE API keys:**

   - **Gemini API**: https://aistudio.google.com/app/apikey
   - **OpenWeatherMap**: https://openweathermap.org/api (1,000 free calls/day)

   📖 See [API_SETUP.md](./API_SETUP.md) for detailed instructions

4. **Run the app:**

   ```bash
   npm run dev
   ```

5. **Open browser:**
   - App runs at `http://localhost:3000`

### 🔐 Authentication & Cloud Sync

Safe Space now uses Supabase Auth. Existing accounts see the dashboard immediately, while first-time sign-ins complete onboarding once. Every user’s Journey page and progress is isolated to their Supabase user.

1. In Supabase → **Authentication → Providers**, enable **Email + Password**.
2. In SQL Editor, create the required tables:

   ```sql
   create table if not exists public.profiles (
     id uuid primary key references auth.users(id) on delete cascade,
     name text,
     condition text default 'prevention',
     age integer,
     age_group text default 'adult',
     streak integer default 0,
     points integer default 0,
     trees_planted integer default 0,
     garden_level integer default 1,
     onboarding_complete boolean default false,
     newsletter_opt_in boolean default true,
     last_login timestamptz default now(),
     created_at timestamptz default now(),
     updated_at timestamptz default now()
   );

      create table if not exists public.journey_progress (
      profile_id uuid primary key references auth.users(id) on delete cascade,
      points integer default 0,
      trees_planted integer default 0,
      streak integer default 0,
      updated_at timestamptz default now()
      );
   ```

   -- If you already had the table, run these once to add the new columns:
   alter table public.profiles
     add column if not exists age integer,
     add column if not exists newsletter_opt_in boolean default true,
     add column if not exists last_login timestamptz default now();

3. Copy the project URL and anon key from Supabase → Settings → API into `.env`.
4. Restart `npm run dev`. You’ll see the login screen, and onboarding will only appear the first time a user signs in. Journey stats now stay in sync per user session.

## 🌐 Real-Time APIs Used

| API                 | Purpose         | Cost          | Required    |
| ------------------- | --------------- | ------------- | ----------- |
| OpenWeatherMap      | Weather + AQI   | FREE (1k/day) | Recommended |
| OpenAQ              | Alternative AQI | FREE          | Optional    |
| Browser Geolocation | User location   | FREE          | Optional    |
| Gemini AI           | Analysis        | FREE          | Required    |

**Note:** App gracefully falls back to mock data if APIs are unavailable.

## 🏗️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6.4
- **Styling:** Tailwind CSS 3.4
- **AI:** Google Gemini 2.5 Flash
- **APIs:** OpenWeatherMap, OpenAQ

## 📦 Build for Production

```bash
npm run build
npm run preview
```

View your app in AI Studio: https://ai.studio/apps/drive/1iSwm9qu7NmmIWV4Xh9uqrYSuhvPcS91K
