-- ============================================
-- CHARACTER SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS characters (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    role VARCHAR(100) NOT NULL,

    bio TEXT,

    specialization VARCHAR(255),

    trust_level INTEGER DEFAULT 50,

    is_core_character BOOLEAN DEFAULT FALSE,

    first_case_id INTEGER REFERENCES game_cases(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_characters (
    id SERIAL PRIMARY KEY,

    case_id INTEGER NOT NULL REFERENCES game_cases(id) ON DELETE CASCADE,

    character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,

    involvement_type VARCHAR(50) NOT NULL,

    notes TEXT,

    UNIQUE(case_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_case_characters_case
ON case_characters(case_id);

CREATE INDEX IF NOT EXISTS idx_case_characters_character
ON case_characters(character_id);