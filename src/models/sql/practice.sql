-- Practice database tables for assignments
-- This file accumulates changes from multiple assignments
-- Add new tables and modifications here as you work through the course
-- Contact form table
CREATE TABLE IF NOT EXISTS contact_form (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    submitted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Add name and email columns to contact_form if they don't exist
ALTER TABLE contact_form
ADD COLUMN IF NOT EXISTS name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS email VARCHAR(255);