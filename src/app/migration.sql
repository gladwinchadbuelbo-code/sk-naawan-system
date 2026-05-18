-- ================================================================
-- SK DIGITAL MANAGEMENT SYSTEM - DATABASE MIGRATION SCRIPT
-- ================================================================
-- Database: PostgreSQL 14+ / Supabase
-- Schema Version: 1.0.0
-- Generated: 2025-12-11
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- 1. USERS TABLE
-- ================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('chairperson', 'treasurer', 'secretary')),
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_username ON users(username);

COMMENT ON TABLE users IS 'SK official user accounts with role-based access';
COMMENT ON COLUMN users.role IS 'User role: chairperson (full access), treasurer (budget), secretary (activities)';

-- ================================================================
-- 2. EVENTS TABLE
-- ================================================================
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    end_date DATE,
    venue VARCHAR(255) NOT NULL,
    time VARCHAR(50) NOT NULL,
    budget DECIMAL(10,2) NOT NULL CHECK (budget >= 0),
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Upcoming', 'Completed', 'Cancelled')),
    assigned_officials JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '{"photos":[],"receipts":[],"attendance":null,"others":[]}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= date),
    CONSTRAINT title_min_length CHECK (LENGTH(TRIM(title)) >= 3),
    CONSTRAINT venue_min_length CHECK (LENGTH(TRIM(venue)) >= 3)
);

-- Indexes
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_by ON events(created_by);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE events IS 'SK events, activities, and programs with scheduling and budget tracking';

-- ================================================================
-- 3. RECEIPTS TABLE
-- ================================================================
CREATE TABLE receipts (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    upload_date TIMESTAMP DEFAULT NOW(),
    category VARCHAR(100) NOT NULL,
    or_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    supplier VARCHAR(255) NOT NULL,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT or_number_format CHECK (or_number ~ '^[A-Z0-9-]+$')
);

-- Indexes
CREATE UNIQUE INDEX idx_receipts_or_number ON receipts(or_number);
CREATE INDEX idx_receipts_category ON receipts(category);
CREATE INDEX idx_receipts_uploaded_by ON receipts(uploaded_by);

COMMENT ON TABLE receipts IS 'Uploaded receipt documents for expense verification';

-- ================================================================
-- 4. FUND_ENTRIES TABLE
-- ================================================================
CREATE TABLE fund_entries (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    or_number VARCHAR(50),
    supplier VARCHAR(255),
    receipt_id BIGINT REFERENCES receipts(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT expense_requires_or CHECK (
        type = 'income' OR (type = 'expense' AND or_number IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX idx_fund_entries_type ON fund_entries(type);
CREATE INDEX idx_fund_entries_category ON fund_entries(category);
CREATE INDEX idx_fund_entries_date ON fund_entries(date);
CREATE INDEX idx_fund_entries_created_by ON fund_entries(created_by);
CREATE INDEX idx_fund_entries_receipt_id ON fund_entries(receipt_id);

COMMENT ON TABLE fund_entries IS 'Income and expense transactions for SK budget management';

-- ================================================================
-- 5. ACTIVITY_PROPOSALS TABLE
-- ================================================================
CREATE TABLE activity_proposals (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    budget DECIMAL(10,2) NOT NULL CHECK (budget >= 0),
    target_participants INTEGER NOT NULL CHECK (target_participants > 0),
    requirements JSONB DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submitted_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'returned')),
    comments TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_date TIMESTAMP,
    CONSTRAINT title_min_length CHECK (LENGTH(TRIM(title)) >= 5),
    CONSTRAINT description_min_length CHECK (LENGTH(TRIM(description)) >= 20)
);

-- Indexes
CREATE INDEX idx_activity_proposals_status ON activity_proposals(status);
CREATE INDEX idx_activity_proposals_submitted_by ON activity_proposals(submitted_by);
CREATE INDEX idx_activity_proposals_reviewed_by ON activity_proposals(reviewed_by);
CREATE INDEX idx_activity_proposals_date ON activity_proposals(date);

COMMENT ON TABLE activity_proposals IS 'Activity/event proposals submitted by Secretary for Chairperson approval';

-- ================================================================
-- 6. BUDGET_PROPOSALS TABLE
-- ================================================================
CREATE TABLE budget_proposals (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submitted_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'returned')),
    comments TEXT,
    approval_date TIMESTAMP,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT title_min_length CHECK (LENGTH(TRIM(title)) >= 5),
    CONSTRAINT description_min_length CHECK (LENGTH(TRIM(description)) >= 20),
    CONSTRAINT items_not_empty CHECK (jsonb_array_length(items) > 0)
);

-- Indexes
CREATE INDEX idx_budget_proposals_status ON budget_proposals(status);
CREATE INDEX idx_budget_proposals_submitted_by ON budget_proposals(submitted_by);
CREATE INDEX idx_budget_proposals_reviewed_by ON budget_proposals(reviewed_by);

COMMENT ON TABLE budget_proposals IS 'Budget allocation proposals submitted by Treasurer for Chairperson approval';

-- ================================================================
-- 7. NOTIFICATIONS TABLE
-- ================================================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    recipient_role VARCHAR(20) CHECK (recipient_role IN ('chairperson', 'treasurer', 'secretary')),
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    link VARCHAR(500),
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT recipient_specified CHECK (
        recipient_role IS NOT NULL OR recipient_id IS NOT NULL
    )
);

-- Indexes
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_timestamp ON notifications(timestamp DESC);

COMMENT ON TABLE notifications IS 'System notifications for proposal approvals, comments, and updates';

-- ================================================================
-- 8. ACTIVITY_LOGS TABLE
-- ================================================================
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp DESC);
CREATE INDEX idx_activity_logs_type ON activity_logs(type);

COMMENT ON TABLE activity_logs IS 'Audit trail of all system actions for accountability';

-- ================================================================
-- 9. SETTINGS TABLE
-- ================================================================
CREATE TABLE settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    sk_name VARCHAR(255) NOT NULL,
    barangay VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    fiscal_year VARCHAR(20) NOT NULL,
    logo_url TEXT,
    public_portal_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT single_settings_row CHECK (id = 'default')
);

-- Auto-update trigger
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO settings (id, sk_name, barangay, fiscal_year) 
VALUES ('default', 'Sangguniang Kabataan', 'Barangay Sample', '2025')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE settings IS 'System-wide configuration and SK organization information';

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Chairperson can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'chairperson'
        )
    );

-- Events table policies
CREATE POLICY "Authenticated users can view all events" ON events
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Secretary and Chairperson can insert events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('secretary', 'chairperson')
        )
    );

CREATE POLICY "Creator and Chairperson can update events" ON events
    FOR UPDATE USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'chairperson'
        )
    );

CREATE POLICY "Public can view approved events" ON events
    FOR SELECT USING (
        status IN ('Upcoming', 'Completed', 'Cancelled') AND
        auth.uid() IS NULL
    );

-- Fund entries policies
CREATE POLICY "Authenticated users can view all fund entries" ON fund_entries
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Treasurer and Chairperson can insert fund entries" ON fund_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('treasurer', 'chairperson')
        )
    );

CREATE POLICY "Public can view all fund entries" ON fund_entries
    FOR SELECT USING (auth.uid() IS NULL);

-- Activity proposals policies
CREATE POLICY "Authenticated users can view activity proposals" ON activity_proposals
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Secretary can submit activity proposals" ON activity_proposals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'secretary'
        )
    );

CREATE POLICY "Chairperson can update activity proposals" ON activity_proposals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'chairperson'
        )
    );

CREATE POLICY "Public can view approved activity proposals" ON activity_proposals
    FOR SELECT USING (status = 'approved' AND auth.uid() IS NULL);

-- Budget proposals policies
CREATE POLICY "Authenticated users can view budget proposals" ON budget_proposals
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Treasurer can submit budget proposals" ON budget_proposals
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'treasurer'
        )
    );

CREATE POLICY "Chairperson can update budget proposals" ON budget_proposals
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'chairperson'
        )
    );

CREATE POLICY "Public can view approved budget proposals" ON budget_proposals
    FOR SELECT USING (status = 'approved' AND auth.uid() IS NULL);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        recipient_id = auth.uid() OR
        recipient_role IN (
            SELECT role FROM users WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (recipient_id = auth.uid());

-- Activity logs policies
CREATE POLICY "Authenticated users can view activity logs" ON activity_logs
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Settings policies
CREATE POLICY "Everyone can view settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Chairperson can update settings" ON settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'chairperson'
        )
    );

-- ================================================================
-- UTILITY FUNCTIONS
-- ================================================================

-- Function to get total budget
CREATE OR REPLACE FUNCTION get_total_budget()
RETURNS DECIMAL(10,2) AS $$
    SELECT COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0)
    FROM fund_entries;
$$ LANGUAGE SQL STABLE;

-- Function to get budget utilization rate
CREATE OR REPLACE FUNCTION get_budget_utilization()
RETURNS DECIMAL(5,2) AS $$
    SELECT 
        CASE 
            WHEN income.total = 0 THEN 0
            ELSE ROUND((expense.total / income.total * 100)::numeric, 2)
        END
    FROM 
        (SELECT COALESCE(SUM(amount), 0) as total FROM fund_entries WHERE type = 'income') income,
        (SELECT COALESCE(SUM(amount), 0) as total FROM fund_entries WHERE type = 'expense') expense;
$$ LANGUAGE SQL STABLE;

-- Function to count pending approvals
CREATE OR REPLACE FUNCTION count_pending_approvals()
RETURNS INTEGER AS $$
    SELECT 
        (SELECT COUNT(*) FROM activity_proposals WHERE status = 'pending') +
        (SELECT COUNT(*) FROM budget_proposals WHERE status = 'pending');
$$ LANGUAGE SQL STABLE;

-- ================================================================
-- SAMPLE DATA (for testing)
-- ================================================================

-- Insert sample users (password: 'password123' hashed with bcrypt)
INSERT INTO users (username, full_name, password, role) VALUES
('sk_chair', 'Juan Dela Cruz', '$2b$10$rQJ5qXZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', 'chairperson'),
('sk_treasurer', 'Maria Santos', '$2b$10$rQJ5qXZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', 'treasurer'),
('sk_secretary', 'Pedro Reyes', '$2b$10$rQJ5qXZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZxZx', 'secretary')
ON CONFLICT (username) DO NOTHING;

-- ================================================================
-- GRANTS (adjust based on your auth system)
-- ================================================================

-- Grant appropriate permissions to authenticated role
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE ON events, fund_entries, receipts TO authenticated;
GRANT INSERT ON activity_proposals, budget_proposals TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ================================================================
-- MIGRATION COMPLETE
-- ================================================================
-- Next steps:
-- 1. Review and adjust RLS policies based on your auth setup
-- 2. Update password hashes for sample users
-- 3. Configure Supabase Storage for file uploads
-- 4. Set up scheduled backups
-- 5. Test all CRUD operations with different roles
-- ================================================================
