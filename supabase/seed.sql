-- seed.sql
-- Realistic development seed data for SleepCycleCalc.
-- Uses a fixed test user UUID. All dates are relative to NOW() so data stays fresh.
--
-- NOTE: This seed assumes the test user already exists in auth.users.
-- For local dev with Supabase CLI, create the auth user first:
--   supabase auth admin create-user --email test@sleepcyclecalc.dev --password testpass123
-- Then update the UUID below to match, or insert directly into auth.users.

-- ============================================================
-- Test user profile
-- ============================================================
INSERT INTO public.profiles (id, email, display_name, timezone, age_years, subscription_tier, preferences)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@sleepcyclecalc.dev',
  'Test Sleeper',
  'America/New_York',
  32,
  'pro',
  '{"default_calculator": "bedtime", "notifications": true, "theme": "dark"}'
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  timezone = EXCLUDED.timezone,
  age_years = EXCLUDED.age_years,
  subscription_tier = EXCLUDED.subscription_tier,
  preferences = EXCLUDED.preferences;

-- ============================================================
-- Mock Oura device connection
-- ============================================================
INSERT INTO public.device_connections (id, user_id, provider, access_token, refresh_token, scopes, provider_user_id, connected_at, last_sync_at, token_expires_at, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'oura',
  'encrypted:mock_oura_access_token_for_dev',
  'encrypted:mock_oura_refresh_token_for_dev',
  ARRAY['daily', 'heartrate', 'session', 'sleep'],
  'oura_user_12345',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '2 hours',
  NOW() + INTERVAL '7 days',
  TRUE
)
ON CONFLICT (user_id, provider) DO UPDATE SET
  last_sync_at = EXCLUDED.last_sync_at,
  token_expires_at = EXCLUDED.token_expires_at;

-- ============================================================
-- 14 days of realistic sleep sessions
-- ============================================================
INSERT INTO public.sleep_sessions (
  user_id, source, source_session_id,
  bedtime_start, bedtime_end, sleep_onset, wake_time,
  total_duration_min, sleep_latency_min,
  deep_min, light_min, rem_min, awake_min,
  efficiency, sleep_score, cycles_completed,
  avg_heart_rate, min_heart_rate, resting_heart_rate,
  hrv_rmssd, respiratory_rate, spo2, skin_temp_delta,
  disturbance_count, is_nap, hypnogram
) VALUES

-- Day 1 (13 days ago): Great night
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_001',
  (NOW() - INTERVAL '13 days')::date + TIME '22:15',
  (NOW() - INTERVAL '13 days')::date + INTERVAL '1 day' + TIME '06:30',
  (NOW() - INTERVAL '13 days')::date + TIME '22:28',
  (NOW() - INTERVAL '13 days')::date + INTERVAL '1 day' + TIME '06:25',
  468, 13,
  95, 210, 118, 45,
  91.50, 88, 5.2,
  58, 49, 52,
  62.30, 15.2, 97.80, -0.12,
  3, FALSE,
  '[{"t":"22:28","s":"light"},{"t":"22:55","s":"deep"},{"t":"23:40","s":"light"},{"t":"00:15","s":"rem"},{"t":"01:00","s":"light"},{"t":"01:30","s":"deep"},{"t":"02:15","s":"light"},{"t":"02:50","s":"rem"},{"t":"03:30","s":"light"},{"t":"04:00","s":"deep"},{"t":"04:35","s":"light"},{"t":"05:10","s":"rem"},{"t":"05:50","s":"light"},{"t":"06:25","s":"awake"}]'
),

-- Day 2 (12 days ago): Average night, later bedtime
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_002',
  (NOW() - INTERVAL '12 days')::date + TIME '23:30',
  (NOW() - INTERVAL '12 days')::date + INTERVAL '1 day' + TIME '07:15',
  (NOW() - INTERVAL '12 days')::date + TIME '23:48',
  (NOW() - INTERVAL '12 days')::date + INTERVAL '1 day' + TIME '07:10',
  432, 18,
  72, 205, 102, 53,
  85.20, 76, 4.8,
  61, 51, 55,
  48.10, 15.8, 97.20, 0.05,
  5, FALSE,
  '[{"t":"23:48","s":"light"},{"t":"00:20","s":"deep"},{"t":"01:05","s":"light"},{"t":"01:40","s":"rem"},{"t":"02:20","s":"awake"},{"t":"02:30","s":"light"},{"t":"03:00","s":"deep"},{"t":"03:40","s":"light"},{"t":"04:15","s":"rem"},{"t":"05:00","s":"light"},{"t":"05:30","s":"deep"},{"t":"06:00","s":"light"},{"t":"06:40","s":"rem"},{"t":"07:10","s":"awake"}]'
),

-- Day 3 (11 days ago): Poor night - stress/restless
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_003',
  (NOW() - INTERVAL '11 days')::date + TIME '00:10',
  (NOW() - INTERVAL '11 days')::date + TIME '06:00',
  (NOW() - INTERVAL '11 days')::date + TIME '00:35',
  (NOW() - INTERVAL '11 days')::date + TIME '05:52',
  298, 25,
  48, 148, 62, 40,
  76.30, 62, 3.3,
  65, 54, 58,
  28.50, 16.4, 96.50, 0.32,
  9, FALSE,
  '[{"t":"00:35","s":"light"},{"t":"01:00","s":"deep"},{"t":"01:30","s":"light"},{"t":"01:55","s":"awake"},{"t":"02:10","s":"light"},{"t":"02:40","s":"rem"},{"t":"03:10","s":"awake"},{"t":"03:25","s":"light"},{"t":"03:55","s":"deep"},{"t":"04:20","s":"light"},{"t":"04:50","s":"rem"},{"t":"05:20","s":"light"},{"t":"05:52","s":"awake"}]'
),

-- Day 4 (10 days ago): Recovery night - good
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_004',
  (NOW() - INTERVAL '10 days')::date + TIME '22:00',
  (NOW() - INTERVAL '10 days')::date + INTERVAL '1 day' + TIME '06:45',
  (NOW() - INTERVAL '10 days')::date + TIME '22:08',
  (NOW() - INTERVAL '10 days')::date + INTERVAL '1 day' + TIME '06:40',
  505, 8,
  108, 218, 128, 51,
  93.20, 91, 5.6,
  56, 48, 51,
  71.40, 14.8, 98.10, -0.18,
  2, FALSE,
  '[{"t":"22:08","s":"light"},{"t":"22:30","s":"deep"},{"t":"23:20","s":"light"},{"t":"23:55","s":"rem"},{"t":"00:40","s":"light"},{"t":"01:10","s":"deep"},{"t":"02:00","s":"light"},{"t":"02:35","s":"rem"},{"t":"03:20","s":"light"},{"t":"03:50","s":"deep"},{"t":"04:30","s":"light"},{"t":"05:10","s":"rem"},{"t":"05:55","s":"light"},{"t":"06:40","s":"awake"}]'
),

-- Day 5 (9 days ago): Average
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_005',
  (NOW() - INTERVAL '9 days')::date + TIME '23:00',
  (NOW() - INTERVAL '9 days')::date + INTERVAL '1 day' + TIME '06:50',
  (NOW() - INTERVAL '9 days')::date + TIME '23:12',
  (NOW() - INTERVAL '9 days')::date + INTERVAL '1 day' + TIME '06:45',
  445, 12,
  82, 198, 110, 55,
  87.40, 80, 4.9,
  59, 50, 53,
  55.20, 15.4, 97.50, -0.05,
  4, FALSE,
  '[{"t":"23:12","s":"light"},{"t":"23:40","s":"deep"},{"t":"00:25","s":"light"},{"t":"01:00","s":"rem"},{"t":"01:40","s":"light"},{"t":"02:10","s":"deep"},{"t":"02:50","s":"light"},{"t":"03:25","s":"rem"},{"t":"04:05","s":"light"},{"t":"04:35","s":"deep"},{"t":"05:10","s":"light"},{"t":"05:50","s":"rem"},{"t":"06:30","s":"light"},{"t":"06:45","s":"awake"}]'
),

-- Day 6 (8 days ago): Weekend - slept in
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_006',
  (NOW() - INTERVAL '8 days')::date + TIME '23:45',
  (NOW() - INTERVAL '8 days')::date + INTERVAL '1 day' + TIME '08:00',
  (NOW() - INTERVAL '8 days')::date + TIME '23:55',
  (NOW() - INTERVAL '8 days')::date + INTERVAL '1 day' + TIME '07:55',
  480, 10,
  98, 215, 120, 47,
  90.10, 85, 5.3,
  57, 48, 52,
  58.70, 15.0, 97.90, -0.10,
  3, FALSE,
  '[{"t":"23:55","s":"light"},{"t":"00:25","s":"deep"},{"t":"01:10","s":"light"},{"t":"01:45","s":"rem"},{"t":"02:30","s":"light"},{"t":"03:00","s":"deep"},{"t":"03:45","s":"light"},{"t":"04:20","s":"rem"},{"t":"05:05","s":"light"},{"t":"05:35","s":"deep"},{"t":"06:10","s":"light"},{"t":"06:50","s":"rem"},{"t":"07:30","s":"light"},{"t":"07:55","s":"awake"}]'
),

-- Day 7 (7 days ago): Weekend - great recovery
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_007',
  (NOW() - INTERVAL '7 days')::date + TIME '22:30',
  (NOW() - INTERVAL '7 days')::date + INTERVAL '1 day' + TIME '07:30',
  (NOW() - INTERVAL '7 days')::date + TIME '22:40',
  (NOW() - INTERVAL '7 days')::date + INTERVAL '1 day' + TIME '07:25',
  518, 10,
  110, 225, 130, 53,
  92.80, 92, 5.7,
  55, 47, 50,
  74.60, 14.6, 98.20, -0.22,
  2, FALSE,
  '[{"t":"22:40","s":"light"},{"t":"23:05","s":"deep"},{"t":"23:55","s":"light"},{"t":"00:30","s":"rem"},{"t":"01:15","s":"light"},{"t":"01:45","s":"deep"},{"t":"02:35","s":"light"},{"t":"03:10","s":"rem"},{"t":"03:55","s":"light"},{"t":"04:25","s":"deep"},{"t":"05:10","s":"light"},{"t":"05:50","s":"rem"},{"t":"06:40","s":"light"},{"t":"07:25","s":"awake"}]'
),

-- Day 8 (6 days ago): Monday - slightly worse
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_008',
  (NOW() - INTERVAL '6 days')::date + TIME '23:15',
  (NOW() - INTERVAL '6 days')::date + INTERVAL '1 day' + TIME '06:30',
  (NOW() - INTERVAL '6 days')::date + TIME '23:30',
  (NOW() - INTERVAL '6 days')::date + INTERVAL '1 day' + TIME '06:25',
  410, 15,
  75, 192, 95, 48,
  86.50, 78, 4.6,
  60, 50, 54,
  50.30, 15.6, 97.30, 0.02,
  5, FALSE,
  '[{"t":"23:30","s":"light"},{"t":"23:55","s":"deep"},{"t":"00:35","s":"light"},{"t":"01:10","s":"rem"},{"t":"01:45","s":"light"},{"t":"02:15","s":"deep"},{"t":"02:50","s":"light"},{"t":"03:25","s":"rem"},{"t":"04:00","s":"awake"},{"t":"04:10","s":"light"},{"t":"04:45","s":"deep"},{"t":"05:15","s":"light"},{"t":"05:55","s":"rem"},{"t":"06:25","s":"awake"}]'
),

-- Day 9 (5 days ago): Decent night
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_009',
  (NOW() - INTERVAL '5 days')::date + TIME '22:45',
  (NOW() - INTERVAL '5 days')::date + INTERVAL '1 day' + TIME '06:30',
  (NOW() - INTERVAL '5 days')::date + TIME '22:55',
  (NOW() - INTERVAL '5 days')::date + INTERVAL '1 day' + TIME '06:28',
  443, 10,
  88, 200, 108, 47,
  89.60, 83, 5.0,
  58, 49, 53,
  56.80, 15.2, 97.60, -0.08,
  3, FALSE,
  '[{"t":"22:55","s":"light"},{"t":"23:20","s":"deep"},{"t":"00:05","s":"light"},{"t":"00:40","s":"rem"},{"t":"01:20","s":"light"},{"t":"01:50","s":"deep"},{"t":"02:35","s":"light"},{"t":"03:10","s":"rem"},{"t":"03:50","s":"light"},{"t":"04:20","s":"deep"},{"t":"04:55","s":"light"},{"t":"05:35","s":"rem"},{"t":"06:10","s":"light"},{"t":"06:28","s":"awake"}]'
),

-- Day 10 (4 days ago): Caffeine late - poor
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_010',
  (NOW() - INTERVAL '4 days')::date + TIME '00:00',
  (NOW() - INTERVAL '4 days')::date + TIME '06:15',
  (NOW() - INTERVAL '4 days')::date + TIME '00:22',
  (NOW() - INTERVAL '4 days')::date + TIME '06:10',
  328, 22,
  55, 165, 72, 36,
  78.80, 65, 3.6,
  63, 53, 57,
  32.40, 16.2, 96.80, 0.25,
  7, FALSE,
  '[{"t":"00:22","s":"light"},{"t":"00:50","s":"deep"},{"t":"01:25","s":"light"},{"t":"01:55","s":"rem"},{"t":"02:25","s":"awake"},{"t":"02:35","s":"light"},{"t":"03:05","s":"deep"},{"t":"03:35","s":"light"},{"t":"04:05","s":"rem"},{"t":"04:35","s":"awake"},{"t":"04:50","s":"light"},{"t":"05:20","s":"rem"},{"t":"05:50","s":"light"},{"t":"06:10","s":"awake"}]'
),

-- Day 11 (3 days ago): Good recovery
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_011',
  (NOW() - INTERVAL '3 days')::date + TIME '22:00',
  (NOW() - INTERVAL '3 days')::date + INTERVAL '1 day' + TIME '06:30',
  (NOW() - INTERVAL '3 days')::date + TIME '22:10',
  (NOW() - INTERVAL '3 days')::date + INTERVAL '1 day' + TIME '06:28',
  495, 10,
  102, 218, 125, 50,
  92.10, 89, 5.5,
  56, 48, 51,
  66.20, 14.9, 98.00, -0.15,
  2, FALSE,
  '[{"t":"22:10","s":"light"},{"t":"22:35","s":"deep"},{"t":"23:25","s":"light"},{"t":"00:00","s":"rem"},{"t":"00:45","s":"light"},{"t":"01:15","s":"deep"},{"t":"02:00","s":"light"},{"t":"02:35","s":"rem"},{"t":"03:20","s":"light"},{"t":"03:50","s":"deep"},{"t":"04:30","s":"light"},{"t":"05:10","s":"rem"},{"t":"05:55","s":"light"},{"t":"06:28","s":"awake"}]'
),

-- Day 12 (2 days ago): Average
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_012',
  (NOW() - INTERVAL '2 days')::date + TIME '23:10',
  (NOW() - INTERVAL '2 days')::date + INTERVAL '1 day' + TIME '06:45',
  (NOW() - INTERVAL '2 days')::date + TIME '23:22',
  (NOW() - INTERVAL '2 days')::date + INTERVAL '1 day' + TIME '06:40',
  448, 12,
  85, 202, 112, 49,
  88.30, 81, 5.0,
  59, 50, 53,
  54.10, 15.3, 97.50, -0.03,
  4, FALSE,
  '[{"t":"23:22","s":"light"},{"t":"23:50","s":"deep"},{"t":"00:35","s":"light"},{"t":"01:10","s":"rem"},{"t":"01:50","s":"light"},{"t":"02:20","s":"deep"},{"t":"03:00","s":"light"},{"t":"03:35","s":"rem"},{"t":"04:15","s":"light"},{"t":"04:45","s":"deep"},{"t":"05:20","s":"light"},{"t":"06:00","s":"rem"},{"t":"06:25","s":"light"},{"t":"06:40","s":"awake"}]'
),

-- Day 13 (yesterday): Good night
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_013',
  (NOW() - INTERVAL '1 day')::date + TIME '22:30',
  NOW()::date + TIME '06:30',
  (NOW() - INTERVAL '1 day')::date + TIME '22:38',
  NOW()::date + TIME '06:28',
  462, 8,
  92, 208, 115, 47,
  90.80, 86, 5.1,
  57, 48, 52,
  60.50, 15.1, 97.80, -0.10,
  3, FALSE,
  '[{"t":"22:38","s":"light"},{"t":"23:00","s":"deep"},{"t":"23:50","s":"light"},{"t":"00:25","s":"rem"},{"t":"01:10","s":"light"},{"t":"01:40","s":"deep"},{"t":"02:25","s":"light"},{"t":"03:00","s":"rem"},{"t":"03:45","s":"light"},{"t":"04:15","s":"deep"},{"t":"04:50","s":"light"},{"t":"05:30","s":"rem"},{"t":"06:10","s":"light"},{"t":"06:28","s":"awake"}]'
),

-- Day 14 (last night): Most recent session
(
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_sess_014',
  NOW()::date + TIME '22:45' - INTERVAL '1 day',
  NOW()::date + TIME '07:00',
  NOW()::date + TIME '22:58' - INTERVAL '1 day',
  NOW()::date + TIME '06:55',
  472, 13,
  90, 212, 118, 52,
  89.50, 84, 5.2,
  58, 49, 53,
  57.90, 15.3, 97.60, -0.07,
  4, FALSE,
  '[{"t":"22:58","s":"light"},{"t":"23:25","s":"deep"},{"t":"00:10","s":"light"},{"t":"00:45","s":"rem"},{"t":"01:30","s":"light"},{"t":"02:00","s":"deep"},{"t":"02:45","s":"light"},{"t":"03:20","s":"rem"},{"t":"04:05","s":"light"},{"t":"04:35","s":"deep"},{"t":"05:10","s":"light"},{"t":"05:50","s":"rem"},{"t":"06:35","s":"light"},{"t":"06:55","s":"awake"}]'
)

ON CONFLICT (user_id, source, source_session_id) DO NOTHING;

-- ============================================================
-- A 20-minute afternoon nap (5 days ago)
-- ============================================================
INSERT INTO public.sleep_sessions (
  user_id, source, source_session_id,
  bedtime_start, bedtime_end, sleep_onset, wake_time,
  total_duration_min, sleep_latency_min,
  deep_min, light_min, rem_min, awake_min,
  efficiency, sleep_score, cycles_completed,
  avg_heart_rate, min_heart_rate, resting_heart_rate,
  hrv_rmssd, respiratory_rate, spo2, skin_temp_delta,
  disturbance_count, is_nap
) VALUES (
  '00000000-0000-0000-0000-000000000001', 'oura', 'oura_nap_001',
  (NOW() - INTERVAL '5 days')::date + TIME '14:00',
  (NOW() - INTERVAL '5 days')::date + TIME '14:25',
  (NOW() - INTERVAL '5 days')::date + TIME '14:05',
  (NOW() - INTERVAL '5 days')::date + TIME '14:24',
  19, 5,
  0, 15, 4, 0,
  95.00, NULL, 0.2,
  62, 55, 55,
  45.00, 15.5, 97.50, 0.00,
  0, TRUE
)
ON CONFLICT (user_id, source, source_session_id) DO NOTHING;

-- ============================================================
-- AI Insights
-- ============================================================
INSERT INTO public.ai_insights (user_id, type, content, data_context, model_used, tokens_used, generated_at)
VALUES
-- Coach insight (2 days ago)
(
  '00000000-0000-0000-0000-000000000001',
  'coach',
  'Your deep sleep has improved 18% this week compared to last week. The earlier bedtime on recovery nights (10:00-10:30 PM) correlates strongly with better deep sleep duration. Consider making 10:30 PM your target bedtime on weeknights. Your HRV also tends to be 15-20ms higher on nights when you go to bed before 11 PM.',
  '{"period": "7d", "avg_deep_min": 88, "prev_avg_deep_min": 74, "avg_bedtime": "22:45", "best_deep_bedtime": "22:15"}',
  'mistralai/mistral-7b-instruct',
  342,
  NOW() - INTERVAL '2 days'
),

-- Weekly digest (5 days ago)
(
  '00000000-0000-0000-0000-000000000001',
  'weekly_digest',
  E'## Your Sleep Week in Review\n\n**Overall Score: 81/100** (up from 75 last week)\n\n### Highlights\n- Best night: Tuesday with a sleep score of 91 and 108 min deep sleep\n- Your average sleep latency improved to 12 min (down from 16 min)\n- Total sleep debt reduced by 45 minutes\n\n### Areas to Watch\n- Wednesday''s late bedtime (12:10 AM) resulted in your lowest score (62)\n- Consider a caffeine cutoff time of 2 PM - your worst nights correlate with later caffeine intake\n\n### This Week''s Goal\nAim for a consistent bedtime between 10:15-10:45 PM at least 5 nights this week.',
  '{"week_start": "2026-03-09", "week_end": "2026-03-15", "avg_score": 81, "prev_avg_score": 75, "best_score": 91, "worst_score": 62, "avg_latency": 12, "total_deep_min": 616}',
  'mistralai/mistral-7b-instruct',
  587,
  NOW() - INTERVAL '5 days'
),

-- Score explanation (yesterday)
(
  '00000000-0000-0000-0000-000000000001',
  'score_explanation',
  'Your sleep score of 84 last night breaks down as follows: **Duration (32/35)** - You got 7h42m of total sleep, just under the optimal 8h target for your age. **Efficiency (18/20)** - 90.8% efficiency is excellent, with only 47 minutes of wake time. **Deep Sleep (17/20)** - 92 minutes of deep sleep is above average for a 32-year-old (typical: 60-90 min). **REM (12/15)** - 115 minutes of REM is good but slightly below your personal average of 118 min. **Restfulness (5/10)** - 3 disturbances detected, which is average for you.',
  '{"session_id": "oura_sess_013", "score": 86, "duration_min": 462, "efficiency": 90.80, "deep_min": 92, "rem_min": 115, "disturbances": 3}',
  'mistralai/mistral-7b-instruct',
  412,
  NOW() - INTERVAL '1 day'
);

-- ============================================================
-- Pro subscription
-- ============================================================
INSERT INTO public.subscriptions (user_id, stripe_subscription_id, stripe_price_id, status, current_period_start, current_period_end)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'sub_mock_test_subscription_001',
  'price_mock_pro_monthly',
  'active',
  NOW() - INTERVAL '15 days',
  NOW() + INTERVAL '15 days'
)
ON CONFLICT (stripe_subscription_id) DO UPDATE SET
  status = EXCLUDED.status,
  current_period_start = EXCLUDED.current_period_start,
  current_period_end = EXCLUDED.current_period_end;
