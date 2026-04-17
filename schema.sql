-- Run this inside your Supabase Dashboard -> SQL Editor

CREATE TYPE user_role AS ENUM ('ADMIN', 'CONTROLLER', 'WORKER');
CREATE TYPE event_status AS ENUM ('planned', 'ongoing', 'completed');
CREATE TYPE attendance_status AS ENUM ('present', 'absent');
CREATE TYPE payment_type AS ENUM ('payment', 'advance');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role user_role NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    age INTEGER,
    job_type TEXT,
    daily_rate NUMERIC DEFAULT 0.0,
    total_earned NUMERIC DEFAULT 0.0,
    total_paid NUMERIC DEFAULT 0.0,
    pending_amount NUMERIC DEFAULT 0.0,
    advance_taken NUMERIC DEFAULT 0.0,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'active'
);

CREATE TABLE controllers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_level TEXT,
    assigned_events_count INTEGER DEFAULT 0
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    controller_id UUID REFERENCES controllers(id) ON DELETE SET NULL,
    total_income NUMERIC DEFAULT 0.0,
    total_expense NUMERIC DEFAULT 0.0,
    status event_status DEFAULT 'planned'
);

CREATE TABLE event_workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    attendance attendance_status,
    work_units NUMERIC DEFAULT 0.0,
    wage_amount NUMERIC DEFAULT 0.0,
    paid_amount NUMERIC DEFAULT 0.0,
    pending_amount NUMERIC DEFAULT 0.0
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    type payment_type NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    note TEXT
);

CREATE TABLE rental_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_name TEXT NOT NULL,
    total_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER DEFAULT 0,
    price_per_unit NUMERIC DEFAULT 0.0,
    condition_status TEXT
);

CREATE TABLE event_rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES rental_items(id) ON DELETE CASCADE,
    quantity_used INTEGER DEFAULT 0
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
