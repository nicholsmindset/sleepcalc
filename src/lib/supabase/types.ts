export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  timezone: string;
  age_years: number | null;
  subscription_tier: "free" | "pro";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DeviceConnection {
  id: string;
  user_id: string;
  provider: "oura" | "fitbit" | "whoop" | "withings" | "garmin";
  access_token: string;
  refresh_token: string | null;
  scopes: string[] | null;
  provider_user_id: string | null;
  connected_at: string;
  last_sync_at: string | null;
  token_expires_at: string | null;
  is_active: boolean;
}

export interface SleepSession {
  id: string;
  user_id: string;
  source: string;
  source_session_id: string | null;
  bedtime_start: string;
  bedtime_end: string;
  sleep_onset: string | null;
  wake_time: string | null;
  total_duration_min: number | null;
  sleep_latency_min: number | null;
  deep_min: number | null;
  light_min: number | null;
  rem_min: number | null;
  awake_min: number | null;
  efficiency: number | null;
  sleep_score: number | null;
  cycles_completed: number | null;
  avg_heart_rate: number | null;
  min_heart_rate: number | null;
  resting_heart_rate: number | null;
  hrv_rmssd: number | null;
  respiratory_rate: number | null;
  spo2: number | null;
  skin_temp_delta: number | null;
  disturbance_count: number | null;
  is_nap: boolean;
  hypnogram: Record<string, unknown>[] | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface AIInsight {
  id: string;
  user_id: string;
  type: "coach" | "weekly_digest" | "anomaly" | "score_explanation";
  content: string;
  data_context: Record<string, unknown> | null;
  model_used: string | null;
  tokens_used: number | null;
  generated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      device_connections: {
        Row: DeviceConnection;
        Insert: Omit<DeviceConnection, "id" | "connected_at">;
        Update: Partial<DeviceConnection>;
      };
      sleep_sessions: {
        Row: SleepSession;
        Insert: Omit<SleepSession, "id" | "created_at">;
        Update: Partial<SleepSession>;
      };
      ai_insights: {
        Row: AIInsight;
        Insert: Omit<AIInsight, "id" | "generated_at">;
        Update: Partial<AIInsight>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, "id" | "created_at" | "updated_at">;
        Update: Partial<Subscription>;
      };
    };
  };
}
