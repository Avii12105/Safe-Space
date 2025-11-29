import { EnvData } from "../types";

/**
 * Real-Time Environmental Data APIs (All FREE)
 *
 * 1. OpenWeatherMap API - Weather + Air Quality
 *    - Free tier: 1,000 calls/day
 *    - Get key: https://openweathermap.org/api
 *
 * 2. OpenAQ API - Air Quality (No API Key Required!)
 *    - Completely free, open data
 *    - URL: https://docs.openaq.org/
 *
 * 3. Geolocation: Browser's native geolocation API (Free)
 *
 * 4. Noise: Not available via free API (using mock data)
 *    - Real noise monitoring requires hardware sensors
 */

interface WeatherApiResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

interface AirQualityApiResponse {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      pm2_5: number;
      pm10: number;
      no2: number;
      o3: number;
    };
  }>;
}

/**
 * Fetch real-time weather data from OpenWeatherMap
 */
export const fetchWeatherData = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<{
  temperature: number;
  humidity: number;
  condition: string;
  locationName: string;
}> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherApiResponse = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      locationName: data.name,
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

/**
 * Fetch real-time air quality data from OpenWeatherMap
 */
export const fetchAirQualityData = async (
  lat: number,
  lon: number,
  apiKey: string
): Promise<{ aqi: number }> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Air Quality API error: ${response.status}`);
    }

    const data: AirQualityApiResponse = await response.json();

    const bucketAqi = data.list[0]?.main?.aqi ?? 3;
    const pm25 = data.list[0]?.components?.pm2_5;

    if (typeof pm25 === "number") {
      return { aqi: calculateAQIFromPM25(pm25) };
    }

    const aqiScale: { [key: number]: number } = {
      1: 25,
      2: 75,
      3: 125,
      4: 175,
      5: 250,
    };

    return { aqi: aqiScale[bucketAqi] || 100 };
  } catch (error) {
    console.error("Air Quality API Error:", error);
    throw error;
  }
};

/**
 * Fetch air quality from OpenAQ (No API key required!)
 * Alternative to OpenWeatherMap AQI
 */
export const fetchOpenAQData = async (
  lat: number,
  lon: number
): Promise<{ aqi: number }> => {
  try {
    // Find nearest station within 25km radius
    const response = await fetch(
      `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=25000&limit=1&parameter=pm25`
    );

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const pm25 =
        data.results[0].measurements.find((m: any) => m.parameter === "pm25")
          ?.value || 50;

      // Convert PM2.5 to US AQI
      const aqi = calculateAQIFromPM25(pm25);
      return { aqi };
    }

    throw new Error("No air quality data available for this location");
  } catch (error) {
    console.error("OpenAQ API Error:", error);
    throw error;
  }
};

/**
 * Convert PM2.5 concentration to US AQI
 */
const calculateAQIFromPM25 = (pm25: number): number => {
  // US EPA AQI breakpoints for PM2.5
  const breakpoints = [
    { cLow: 0, cHigh: 12, aqiLow: 0, aqiHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 250.5, cHigh: 500, aqiLow: 301, aqiHigh: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      const aqi =
        ((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) +
        bp.aqiLow;
      return Math.round(aqi);
    }
  }

  return 500; // Hazardous
};

/**
 * Generate mock noise data (no free API available)
 * Real noise monitoring requires physical sensors
 */
const generateMockNoiseData = (): number => {
  const hour = new Date().getHours();

  // Simulate realistic noise patterns
  if (hour >= 6 && hour < 9) return Math.floor(Math.random() * 15) + 65; // Morning rush
  if (hour >= 9 && hour < 17) return Math.floor(Math.random() * 10) + 60; // Daytime
  if (hour >= 17 && hour < 20) return Math.floor(Math.random() * 20) + 70; // Evening rush
  if (hour >= 20 && hour < 23) return Math.floor(Math.random() * 10) + 55; // Evening
  return Math.floor(Math.random() * 10) + 35; // Night
};

/**
 * Get user's current location using browser geolocation API
 */
export const getUserLocation = (): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported by browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Fetch complete environmental data from real-time APIs
 * Uses OpenWeatherMap for weather + AQI (requires API key)
 */
export const fetchRealTimeEnvironmentData = async (
  apiKey: string,
  useGeolocation: boolean = true,
  overrideCity?: string
): Promise<EnvData> => {
  try {
    // Get user location
    let lat = 28.6139; // Default: New Delhi
    let lon = 77.209;
    let locationNameOverride: string | undefined = undefined;

    if (useGeolocation) {
      try {
        const location = await getUserLocation();
        lat = location.lat;
        lon = location.lon;
        console.log("📍 Geolocation coordinates:", { lat, lon });
      } catch (geoError) {
        console.warn("Geolocation failed, using default location:", geoError);
      }
    } else if (overrideCity && apiKey) {
      // If user provided a city in Settings, geocode it to coords
      try {
        const geo = await geocodeCityToCoords(overrideCity, apiKey);
        lat = geo.lat;
        lon = geo.lon;
        locationNameOverride = geo.name;
        console.log("📍 Using city from Settings:", geo.name);
      } catch (e) {
        console.warn("City geocoding failed, falling back to defaults:", e);
      }
    }

    // Fetch weather and air quality in parallel
    const [weatherData, aqiData] = await Promise.all([
      fetchWeatherData(lat, lon, apiKey),
      fetchAirQualityData(lat, lon, apiKey),
    ]);

    console.log("🌤️ Weather API location:", weatherData.locationName);

    // If we used geolocation, try reverse-geocoding to a more precise locality name
    if (useGeolocation && !overrideCity) {
      try {
        const preciseName = await reverseGeocodeToLocality(lat, lon);
        console.log("🗺️ Reverse geocoded location:", preciseName);
        if (preciseName) {
          locationNameOverride = preciseName;
        }
      } catch (e) {
        // Non-fatal; keep weather API name
        console.warn("⚠️ Reverse geocoding failed:", e);
      }
    }

    const finalLocationName = locationNameOverride || weatherData.locationName;
    console.log("✅ Final location name:", finalLocationName);

    return {
      aqi: aqiData.aqi,
      noiseDb: generateMockNoiseData(),
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      condition: weatherData.condition,
      locationName: finalLocationName,
    };
  } catch (error) {
    console.error("Failed to fetch real-time data:", error);
    throw error;
  }
};

/**
 * OpenWeatherMap Geocoding API: Convert city name to coordinates
 */
export const geocodeCityToCoords = async (
  city: string,
  apiKey: string
): Promise<{ name: string; lat: number; lon: number }> => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    city
  )}&limit=1&appid=${apiKey}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Geocoding error: ${resp.status}`);
  const json = await resp.json();
  if (!Array.isArray(json) || json.length === 0)
    throw new Error("City not found");
  const first = json[0];
  return { name: first.name, lat: first.lat, lon: first.lon };
};

/**
 * Reverse geocode coordinates to a human-friendly locality using OpenStreetMap Nominatim (free, no key).
 * Returns precise neighborhood names like "Goregaon East" instead of generic city names.
 */
export const reverseGeocodeToLocality = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  // Use zoom=18 for more precise neighborhood-level results
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
  const resp = await fetch(url, {
    headers: {
      // Identify app per Nominatim usage policy
      "User-Agent": "SafeSpace-App/1.0 (Environmental Health Monitor)",
    },
  });
  if (!resp.ok) throw new Error(`Reverse geocoding error: ${resp.status}`);
  const json = await resp.json();
  const addr = json?.address;
  if (!addr) return null;

  // Build location name with better hierarchy for Indian addresses
  // Priority: suburb (like "Goregaon East") > neighbourhood > city_district > city
  let locationParts: string[] = [];

  // Primary locality (most specific)
  const primaryLocality =
    addr.suburb ||
    addr.neighbourhood ||
    addr.quarter ||
    addr.hamlet ||
    addr.residential ||
    addr.city_district;

  if (primaryLocality) {
    locationParts.push(primaryLocality);
  }

  // City name for context (only if different from primary)
  const cityName = addr.city || addr.town || addr.village || addr.municipality;
  if (cityName && cityName !== primaryLocality) {
    locationParts.push(cityName);
  }

  // Return formatted location or fallback to first part of display_name
  return locationParts.length > 0
    ? locationParts.join(", ")
    : json?.display_name?.split(",")[0] || null;
};

/**
 * Alternative: Fetch using OpenAQ (no API key required!)
 * Falls back to OpenWeatherMap for weather only
 */
export const fetchRealTimeEnvironmentDataOpenAQ = async (
  weatherApiKey: string,
  useGeolocation: boolean = true
): Promise<EnvData> => {
  try {
    let lat = 28.6139;
    let lon = 77.209;

    if (useGeolocation) {
      try {
        const location = await getUserLocation();
        lat = location.lat;
        lon = location.lon;
      } catch (geoError) {
        console.warn("Geolocation failed, using default location:", geoError);
      }
    }

    // Fetch weather from OpenWeatherMap and AQI from OpenAQ
    const [weatherData, aqiData] = await Promise.all([
      fetchWeatherData(lat, lon, weatherApiKey),
      fetchOpenAQData(lat, lon).catch(() => ({ aqi: 50 })), // Fallback if OpenAQ fails
    ]);

    return {
      aqi: aqiData.aqi,
      noiseDb: generateMockNoiseData(),
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      condition: weatherData.condition,
      locationName: weatherData.locationName,
    };
  } catch (error) {
    console.error("Failed to fetch real-time data:", error);
    throw error;
  }
};
