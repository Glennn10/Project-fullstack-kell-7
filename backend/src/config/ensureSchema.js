const pool = require('./db');

const ensureSchema = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS borrowers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            address TEXT,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await pool.query(`
        ALTER TABLE loans
        ADD COLUMN IF NOT EXISTS borrower_id INTEGER;
    `);

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.table_constraints
                WHERE table_schema = 'public'
                    AND table_name = 'loans'
                    AND constraint_name = 'loans_borrower_id_fkey'
            ) THEN
                ALTER TABLE loans
                ADD CONSTRAINT loans_borrower_id_fkey
                FOREIGN KEY (borrower_id)
                REFERENCES borrowers(id)
                ON DELETE CASCADE;
            END IF;
        END
        $$;
    `);
};

module.exports = ensureSchema;
