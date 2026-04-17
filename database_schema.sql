-- =========================================================================
-- LOTUS EVENTS & CATERING - DATABASE SCHEMA + DUMMY DATA
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. USERS TABLE (Handles Authentication & Role-Based Access)
-- -------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed with bcrypt
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'ACCOUNTANT', 'CONTROLLER', 'MEMBER')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 2. MEMBERS TABLE (Worker/Staff specific details)
-- -------------------------------------------------------------------------
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_type VARCHAR(100) NOT NULL, -- e.g., worker, helper, cook, etc.
    daily_rate DECIMAL(10, 2) DEFAULT 0.00,
    total_earned DECIMAL(10, 2) DEFAULT 0.00,
    total_paid DECIMAL(10, 2) DEFAULT 0.00,
    pending_amount DECIMAL(10, 2) DEFAULT 0.00,
    advance_taken DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 3. ACCOUNTANTS TABLE (Finance department specifics)
-- -------------------------------------------------------------------------
CREATE TABLE accountants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department VARCHAR(100) DEFAULT 'Finance',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- 4. CONTROLLERS TABLE (Event operational leaders)
-- -------------------------------------------------------------------------
CREATE TABLE controllers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"can_assign_sub_controllers": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- DUMMY DATA SEEDING
-- =========================================================================

-- Password for all dummy users represents 'password123'
-- (In a real scenario, use bcrypt hashed passwords)

-- Insert Admin
INSERT INTO users (id, name, email, phone, password, role)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Admin user', 'admin@lotus.com', '+15550000001', 'password123', 'ADMIN');

-- Insert Accountant
INSERT INTO users (id, name, email, phone, password, role)
VALUES 
    ('22222222-2222-2222-2222-222222222222', 'Jane Finance', 'accountant@lotus.com', '+15550000002', 'password123', 'ACCOUNTANT');

INSERT INTO accountants (user_id, department)
VALUES ('22222222-2222-2222-2222-222222222222', 'Finance Operations');

-- Insert Controller
INSERT INTO users (id, name, email, phone, password, role)
VALUES 
    ('33333333-3333-3333-3333-333333333333', 'Mike Manager', 'controller@lotus.com', '+15550000003', 'password123', 'CONTROLLER');

INSERT INTO controllers (user_id, permissions)
VALUES ('33333333-3333-3333-3333-333333333333', '{"can_assign_sub_controllers": true}');

-- Insert Member (Worker)
INSERT INTO users (id, name, email, phone, password, role)
VALUES 
    ('44444444-4444-4444-4444-444444444444', 'Rahul Worker', 'rahul@worker.com', '+15550000004', 'password123', 'MEMBER');

INSERT INTO members (user_id, role_type, daily_rate, total_earned, total_paid, pending_amount, advance_taken)
VALUES ('44444444-4444-4444-4444-444444444444', 'cook', 500.00, 10000.00, 7000.00, 3000.00, 0.00);
