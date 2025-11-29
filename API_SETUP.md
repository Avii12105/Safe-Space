# 🌍 Real-Time API Setup Guide

## Overview

Safe Space now uses **real-time environmental data** from free APIs instead of mock data!

---

## 📋 Required APIs

### 1. **OpenWeatherMap API** (Primary - RECOMMENDED)

**What it provides:** Weather + Air Quality + Location
**Cost:** FREE (1,000 calls/day)
**Setup:**

1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (top right)
3. Verify your email
4. Go to: https://home.openweathermap.org/api_keys
5. Copy your API key
6. Add to `.env` file: `VITE_WEATHER_API_KEY=your_key_here`

**Data Coverage:**

- ✅ Real-time weather (temperature, humidity, condition)
- ✅ Air Quality Index (AQI)
- ✅ Location name
- ❌ Noise levels (not available - using time-based simulation)

---

### 2. **OpenAQ API** (Alternative - No Key Required!)

**What it provides:** Air Quality only
**Cost:** 100% FREE, no registration
**Setup:** No setup needed! Already integrated.

**Data Coverage:**

- ✅ Air Quality (PM2.5, PM10, NO2, O3)
- ❌ Weather data (need OpenWeatherMap for this)
- ⚠️ Limited coverage (may not have data for your location)

**When to use:**

- If you don't want to sign up for OpenWeatherMap
- If OpenWeatherMap quota exceeded
- For testing without API keys

---

### 3. **Browser Geolocation** (Built-in)

**What it provides:** User's current location (latitude/longitude)
**Cost:** FREE (no API key)
**Setup:** Browser will ask for permission automatically

---

## 🚀 Quick Start

### Step 1: Get OpenWeatherMap API Key

```
1. Visit: https://openweathermap.org/api
2. Sign up for free account
3. Verify email
4. Copy API key from dashboard
```

### Step 2: Create `.env` file

```bash
# In the Safe-Space folder, create a file named .env
# Copy contents from .env.example
```

### Step 3: Add your API keys to `.env`

```env
VITE_API_KEY=your_gemini_api_key
VITE_WEATHER_API_KEY=your_openweathermap_key
```

### Step 4: Restart dev server

```bash
npm run dev
```

---

## 📊 What Data is Real vs Simulated

| Data Type             | Source                  | Status         |
| --------------------- | ----------------------- | -------------- |
| **Temperature**       | OpenWeatherMap API      | ✅ Real-time   |
| **Humidity**          | OpenWeatherMap API      | ✅ Real-time   |
| **Weather Condition** | OpenWeatherMap API      | ✅ Real-time   |
| **Air Quality (AQI)** | OpenWeatherMap / OpenAQ | ✅ Real-time   |
| **Location Name**     | OpenWeatherMap          | ✅ Real-time   |
| **Geolocation**       | Browser API             | ✅ Real-time   |
| **Noise Levels**      | Time-based simulation   | ⚠️ Simulated\* |

\*Note: Real noise monitoring requires physical hardware sensors. There are no free APIs for ambient noise levels.

---

## 🔄 Fallback Behavior

The app is smart and handles API failures gracefully:

1. **No API Key** → Uses mock data
2. **API Limit Reached** → Falls back to mock data
3. **Network Error** → Falls back to mock data
4. **Geolocation Denied** → Uses default location (New Delhi)

---

## 🎯 API Request Flow

```
User clicks "Begin Analysis"
    ↓
Request geolocation (if enabled)
    ↓
Fetch Weather Data (OpenWeatherMap)
    ↓
Fetch Air Quality (OpenWeatherMap or OpenAQ)
    ↓
Generate noise simulation
    ↓
Send to Gemini AI for analysis
    ↓
Display results
```

---

## 💡 Pro Tips

### Optimize API Usage

- OpenWeatherMap free tier: 1,000 calls/day = ~1 call every 1.5 minutes
- Cache data in localStorage to reduce API calls
- Set refresh interval to 10-15 minutes

### Testing Without APIs

- Leave `.env` empty → app uses mock data
- Perfect for development/testing

### Multiple Locations

- Enable geolocation → automatically detects your location
- Disable geolocation → uses default coordinates (New Delhi)

---

## 🌐 API Endpoints Used

### OpenWeatherMap

```
Current Weather:
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={key}

Air Pollution:
GET https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={key}
```

### OpenAQ (No Key Required)

```
Latest Measurements:
GET https://api.openaq.org/v2/latest?coordinates={lat},{lon}&radius=25000&limit=1&parameter=pm25
```

---

## ❓ Troubleshooting

### "Invalid API key"

- Check your `.env` file has correct key
- Verify key is active on OpenWeatherMap dashboard
- Wait 2 hours after creating new key (activation time)

### "No data available"

- Your location may not have OpenAQ sensors nearby
- OpenWeatherMap should still work globally
- App will fall back to mock data if all APIs fail

### "Geolocation permission denied"

- Browser blocked location access
- App will use default location (New Delhi)
- You can manually set coordinates in code

### Console shows "Using mock data"

- No `VITE_WEATHER_API_KEY` in `.env` file
- API key is invalid/expired
- API quota exceeded for the day

---

## 🔐 Security Notes

- Never commit `.env` file to git (already in `.gitignore`)
- API keys are safe in Vite (only exposed in client bundle)
- For production, use environment variables in hosting platform
- Free tier API keys are rate-limited, not sensitive

---

## 📈 Future Enhancements

Potential real-time data sources:

- **Noise:** Web Audio API (microphone access)
- **UV Index:** OpenWeatherMap UV API
- **Pollen Count:** OpenWeatherMap Pollen API (paid)
- **Traffic Noise:** Google Maps Traffic API (paid)

---

## 🎉 Success Checklist

- [ ] Signed up for OpenWeatherMap account
- [ ] Created `.env` file from `.env.example`
- [ ] Added `VITE_WEATHER_API_KEY` to `.env`
- [ ] Restarted dev server
- [ ] Allowed geolocation permission in browser
- [ ] Seeing real weather data in app
- [ ] Console shows "✅ Real-time data fetched successfully"

---

**Need Help?** Check the browser console for detailed error messages and API responses.
