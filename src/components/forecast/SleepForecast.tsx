'use client';

import { useState, useEffect, useCallback } from 'react';
import { Thermometer, Droplets, Wind, Moon } from 'lucide-react';
import { getMoonPhase } from '@/utils/moon';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface WeatherData {
  tempC: number;
  humidity: number;
  windspeed: number;
  weathercode: number;
}

interface SunData {
  sunrise: string; // HH:MM
  sunset: string;  // HH:MM
}

export interface ForecastData {
  weather: WeatherData;
  sun: SunData;
  moonPhase: ReturnType<typeof getMoonPhase>;
  score: number;
  scoreLabel: string;
  scoreColor: string;
  factors: ForecastFactor[];
  tip: string;
}

interface ForecastFactor {
  label: string;
  value: string;
  rating: 'good' | 'ok' | 'poor';
  icon: React.ElementType;
}

const CACHE_KEY = 'sleepstack_forecast';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/* -------------------------------------------------------------------------- */
/*  Score Calculation                                                         */
/* -------------------------------------------------------------------------- */

function computeScore(weather: WeatherData): { score: number; factors: { temp: number; humidity: number; wind: number } } {
  // Temperature: ideal 15–20°C → 50 pts, scales down outside that
  let tempScore: number;
  const t = weather.tempC;
  if (t >= 15 && t <= 20) tempScore = 50;
  else if (t >= 12 && t < 15) tempScore = 40;
  else if (t > 20 && t <= 24) tempScore = 38;
  else if (t >= 10 && t < 12) tempScore = 25;
  else if (t > 24 && t <= 28) tempScore = 22;
  else tempScore = Math.max(0, 50 - Math.abs(t - 17.5) * 4);

  // Humidity: ideal 40–60% → 30 pts
  let humScore: number;
  const h = weather.humidity;
  if (h >= 40 && h <= 60) humScore = 30;
  else if (h >= 30 && h < 40) humScore = 22;
  else if (h > 60 && h <= 70) humScore = 22;
  else if (h >= 20 && h < 30) humScore = 12;
  else if (h > 70 && h <= 80) humScore = 12;
  else humScore = Math.max(0, 30 - Math.abs(h - 50) * 0.6);

  // Wind: low wind → 20 pts; storms disrupt sleep
  let windScore: number;
  const w = weather.windspeed;
  if (w < 10) windScore = 20;
  else if (w < 20) windScore = 15;
  else if (w < 30) windScore = 10;
  else if (w < 50) windScore = 5;
  else windScore = 0;

  const score = Math.round(tempScore + humScore + windScore);
  return { score, factors: { temp: Math.round(tempScore), humidity: Math.round(humScore), wind: Math.round(windScore) } };
}

function rateTemp(t: number): 'good' | 'ok' | 'poor' {
  if (t >= 15 && t <= 20) return 'good';
  if (t >= 12 && t <= 24) return 'ok';
  return 'poor';
}
function rateHumidity(h: number): 'good' | 'ok' | 'poor' {
  if (h >= 40 && h <= 60) return 'good';
  if (h >= 25 && h <= 75) return 'ok';
  return 'poor';
}
function rateWind(w: number): 'good' | 'ok' | 'poor' {
  if (w < 10) return 'good';
  if (w < 30) return 'ok';
  return 'poor';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 35) return 'Poor';
  return 'Challenging';
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#46eae5';
  if (score >= 65) return '#55efc4';
  if (score >= 50) return '#f9ca24';
  if (score >= 35) return '#fdcb6e';
  return '#ff6b6b';
}

function getTip(weather: WeatherData, score: number): string {
  if (weather.tempC > 24) return 'It\'s warm tonight — run a fan for white noise and airflow, or open a window if the outdoor temperature drops later.';
  if (weather.tempC < 12) return 'Cold night — keep the bedroom at 18°C (65°F) with extra blankets rather than heavy heating, which dries the air.';
  if (weather.humidity > 70) return 'High humidity can make it harder to stay cool while sleeping. A dehumidifier or air conditioning can improve comfort significantly.';
  if (weather.humidity < 30) return 'Low humidity tonight — a cool-mist humidifier in the bedroom can prevent dry throat and sinus irritation that disrupts sleep.';
  if (weather.windspeed > 30) return 'Gusty conditions tonight may cause noise. Consider earplugs or a white noise machine to mask intermittent sounds.';
  if (score >= 80) return 'Near-ideal sleep environment tonight. Crack the window slightly to let in fresh air and enjoy optimal sleeping conditions.';
  return 'Conditions are decent tonight. Blackout curtains, a consistent bedtime, and avoiding screens will round out a good sleep environment.';
}

/* -------------------------------------------------------------------------- */
/*  API Fetch                                                                 */
/* -------------------------------------------------------------------------- */

async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  const [weatherRes, sunRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`,
    ),
    fetch(
      `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lon}&formatted=0`,
    ),
  ]);

  if (!weatherRes.ok) throw new Error('Weather fetch failed');
  if (!sunRes.ok) throw new Error('Sun data fetch failed');

  const weatherJson = await weatherRes.json();
  const sunJson = await sunRes.json();

  const current = weatherJson.current;
  const weather: WeatherData = {
    tempC: Math.round(current.temperature_2m * 10) / 10,
    humidity: current.relative_humidity_2m,
    windspeed: Math.round(current.wind_speed_10m),
    weathercode: current.weather_code,
  };

  // Parse sunrise/sunset ISO strings → HH:MM
  const parseSunTime = (iso: string): string => {
    const d = new Date(iso);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const sun: SunData = {
    sunrise: parseSunTime(sunJson.results.sunrise),
    sunset: parseSunTime(sunJson.results.sunset),
  };

  const moonPhase = getMoonPhase(new Date());
  const { score } = computeScore(weather);

  const factors: ForecastFactor[] = [
    {
      label: 'Temperature',
      value: `${weather.tempC}°C`,
      rating: rateTemp(weather.tempC),
      icon: Thermometer,
    },
    {
      label: 'Humidity',
      value: `${weather.humidity}%`,
      rating: rateHumidity(weather.humidity),
      icon: Droplets,
    },
    {
      label: 'Wind Speed',
      value: `${weather.windspeed} km/h`,
      rating: rateWind(weather.windspeed),
      icon: Wind,
    },
    {
      label: 'Moon',
      value: `${moonPhase.emoji} ${moonPhase.illumination}%`,
      rating: moonPhase.illumination > 80 ? 'poor' : moonPhase.illumination > 50 ? 'ok' : 'good',
      icon: Moon,
    },
  ];

  return {
    weather,
    sun,
    moonPhase,
    score,
    scoreLabel: getScoreLabel(score),
    scoreColor: getScoreColor(score),
    factors,
    tip: getTip(weather, score),
  };
}

/* -------------------------------------------------------------------------- */
/*  Cache helpers                                                             */
/* -------------------------------------------------------------------------- */

function readCache(lat: number, lon: number): ForecastData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    if (Math.abs(parsed.lat - lat) > 0.1 || Math.abs(parsed.lon - lon) > 0.1) return null;
    return parsed.data as ForecastData;
  } catch {
    return null;
  }
}

function writeCache(lat: number, lon: number, data: ForecastData): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), lat, lon, data }));
  } catch {
    // ignore storage errors
  }
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const RATING_COLORS = { good: '#46eae5', ok: '#f9ca24', poor: '#ff6b6b' };
const RATING_LABELS = { good: 'Good', ok: 'Fair', poor: 'Poor' };

export function SleepForecast() {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'denied' | 'error'>('idle');
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  const load = useCallback(() => {
    setState('loading');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        const cached = readCache(lat, lon);
        if (cached) {
          setForecast(cached);
          setState('done');
          return;
        }
        try {
          const data = await fetchForecast(lat, lon);
          writeCache(lat, lon, data);
          setForecast(data);
          setState('done');
        } catch {
          setState('error');
        }
      },
      () => setState('denied'),
      { timeout: 8000 },
    );
  }, []);

  // Auto-trigger on mount if permission already granted
  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') load();
    });
  }, [load]);

  const fmt12 = (hhmm: string) => {
    if (!hhmm || !hhmm.includes(':')) return hhmm;
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  if (state === 'idle' || state === 'denied' || state === 'error') {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <p className="text-2xl mb-3">🌙</p>
        <p className="font-headline text-lg font-bold text-on-surface mb-2">Tonight&apos;s Sleep Forecast</p>
        {state === 'denied' && (
          <p className="text-sm text-on-surface-variant mb-4">
            Location access was denied. Enable it in your browser settings to get your local forecast.
          </p>
        )}
        {state === 'error' && (
          <p className="text-sm text-on-surface-variant mb-4">
            Couldn&apos;t load weather data. Check your connection and try again.
          </p>
        )}
        {state === 'idle' && (
          <p className="text-sm text-on-surface-variant mb-4">
            Check tonight&apos;s sleep environment score based on your local temperature, humidity, wind, and moon phase.
          </p>
        )}
        <button
          onClick={load}
          className="rounded-2xl px-6 py-3 text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #6c5ce7, #00cec9)', color: '#fff' }}
        >
          {state === 'error' || state === 'denied' ? 'Try Again' : 'Get My Sleep Forecast'}
        </button>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-sm text-on-surface-variant">Fetching local conditions…</p>
      </div>
    );
  }

  if (!forecast) return null;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-secondary-container/15 blur-[60px]" />

      <div className="relative">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-3">
          Tonight&apos;s Sleep Environment
        </p>

        {/* Score */}
        <div className="flex items-baseline gap-3 mb-6">
          <span
            className="font-headline text-5xl font-extrabold"
            style={{ color: forecast.scoreColor }}
          >
            {forecast.score}
          </span>
          <div>
            <span className="text-lg font-semibold text-on-surface">/100</span>
            <p className="text-sm font-semibold" style={{ color: forecast.scoreColor }}>
              {forecast.scoreLabel}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-on-surface-variant">Sunrise</p>
            <p className="font-mono text-sm text-on-surface">{fmt12(forecast.sun.sunrise)}</p>
            <p className="text-xs text-on-surface-variant mt-1">Sunset</p>
            <p className="font-mono text-sm text-on-surface">{fmt12(forecast.sun.sunset)}</p>
          </div>
        </div>

        {/* Factor grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {forecast.factors.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="bg-surface-container/40 rounded-2xl p-3 text-center">
                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: RATING_COLORS[f.rating] }} />
                <p className="font-mono text-sm font-semibold text-on-surface">{f.value}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">{f.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: RATING_COLORS[f.rating] }}>
                  {RATING_LABELS[f.rating]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <p className="text-sm text-on-surface-variant leading-relaxed">
          <span className="text-[#46eae5] font-semibold">Tonight&apos;s tip: </span>
          {forecast.tip}
        </p>
      </div>
    </div>
  );
}
