-- ColdCraft Schema
-- Creates tables for usage tracking and user profiles

-- Create coldcraft schema
CREATE SCHEMA IF NOT EXISTS coldcraft;

-- Profiles table (links to auth.users)
CREATE TABLE IF NOT EXISTS coldcraft.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS coldcraft.usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  fingerprint TEXT,
  date DATE DEFAULT CURRENT_DATE,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date),
  UNIQUE(ip_address, date)
);

-- Enable RLS
ALTER TABLE coldcraft.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE coldcraft.usage ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON coldcraft.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON coldcraft.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Usage policies (service role only for writes)
CREATE POLICY "Users can view own usage" ON coldcraft.usage
  FOR SELECT USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION coldcraft.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO coldcraft.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created_coldcraft ON auth.users;
CREATE TRIGGER on_auth_user_created_coldcraft
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION coldcraft.handle_new_user();

-- Index for fast usage lookups
CREATE INDEX IF NOT EXISTS idx_usage_ip_date ON coldcraft.usage(ip_address, date);
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON coldcraft.usage(user_id, date);
