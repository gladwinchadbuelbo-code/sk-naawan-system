-- SK Naawan IMS - PostgreSQL Database Schema
-- Updated for Proposal Workflow and Attendance Management

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS event_documents CASCADE;
DROP TABLE IF EXISTS budget_proposal_items CASCADE;
DROP TABLE IF EXISTS budget_proposals CASCADE;
DROP TABLE IF EXISTS activity_proposals CASCADE;
DROP TABLE IF EXISTS funds CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('chairperson', 'treasurer', 'secretary', 'public_viewer')),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Proposals table (needed before events)
CREATE TABLE budget_proposals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    total_amount DECIMAL(12, 2) NOT NULL,
    purpose VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'returned')),
    chairperson_feedback TEXT,
    submitted_by INTEGER REFERENCES users(id),
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'Planning' CHECK (status IN ('Planning', 'Upcoming', 'Completed', 'Cancelled')),
    budget_proposal_id INTEGER REFERENCES budget_proposals(id),
    created_by INTEGER REFERENCES users(id),
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table (Capstone Requirement)
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    participant_name VARCHAR(150) NOT NULL,
    barangay VARCHAR(100),
    age INTEGER,
    gender VARCHAR(20),
    time_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    qr_code_used BOOLEAN DEFAULT FALSE,
    recorded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Funds table (Income and Expenses)
CREATE TABLE funds (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    source VARCHAR(200),
    description TEXT,
    or_number VARCHAR(50),
    receipt_url TEXT,
    date DATE NOT NULL,
    event_id INTEGER REFERENCES events(id),
    created_by INTEGER REFERENCES users(id),
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Proposals table
CREATE TABLE activity_proposals (
    id SERIAL PRIMARY KEY,
    project_title VARCHAR(200) NOT NULL,
    project_proponent VARCHAR(200) NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    objectives TEXT NOT NULL,
    rationale TEXT NOT NULL,
    target_beneficiaries TEXT NOT NULL,
    budget_requirement DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'returned')),
    chairperson_comments TEXT,
    submitted_by INTEGER REFERENCES users(id),
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Proposal Items table
CREATE TABLE budget_proposal_items (
    id SERIAL PRIMARY KEY,
    budget_proposal_id INTEGER REFERENCES budget_proposals(id) ON DELETE CASCADE,
    item VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(12, 2) NOT NULL,
    total_cost DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event Documents table
CREATE TABLE event_documents (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    link VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(100) NOT NULL,
    action VARCHAR(200) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_attendance_event ON attendance(event_id);
CREATE INDEX idx_funds_date ON funds(date);
CREATE INDEX idx_activity_proposals_status ON activity_proposals(status);
CREATE INDEX idx_budget_proposals_status ON budget_proposals(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_funds_updated_at BEFORE UPDATE ON funds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activity_proposals_updated_at BEFORE UPDATE ON activity_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_proposals_updated_at BEFORE UPDATE ON budget_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
