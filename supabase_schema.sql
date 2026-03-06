-- Schema for E-Learning Platform

-- Enums
CREATE TYPE plan_tier_enum AS ENUM ('basic', 'silver', 'premium', 'gold');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    plan_tier plan_tier_enum DEFAULT 'basic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    total_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Daily Lessons Table
CREATE TABLE daily_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    day_number INTEGER NOT NULL,
    text_content TEXT,
    mux_playback_id TEXT,
    quiz_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(course_id, day_number)
);

-- User Progress Table
CREATE TABLE user_progress (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES daily_lessons(id) ON DELETE CASCADE NOT NULL,
    quiz_score INTEGER,
    is_completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY(user_id, lesson_id)
);

-- Note: RLS (Row Level Security) policies should be added later based on app requirements.
