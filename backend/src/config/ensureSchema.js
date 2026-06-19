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
        ALTER TABLE loans
        ADD COLUMN IF NOT EXISTS due_date DATE;
    `);

    await pool.query(`
        ALTER TABLE loans
        ADD COLUMN IF NOT EXISTS return_condition VARCHAR(20),
        ADD COLUMN IF NOT EXISTS return_notes TEXT;
    `);

    await pool.query(`
        UPDATE loans
        SET due_date = (loan_date + INTERVAL '7 days')::date
        WHERE due_date IS NULL;
    `);

    await pool.query(`
        ALTER TABLE borrowers
        ADD COLUMN IF NOT EXISTS user_id INTEGER;
    `);

    await pool.query(`
        ALTER TABLE borrowers
        ADD COLUMN IF NOT EXISTS membership_status VARCHAR(20) NOT NULL DEFAULT 'Aktif';
    `);

    await pool.query(`
        ALTER TABLE books
        ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE;
    `);

    await pool.query(`
        ALTER TABLE books
        ADD COLUMN IF NOT EXISTS inventory_status VARCHAR(30) NOT NULL DEFAULT 'Tersedia';
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

    await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM information_schema.table_constraints
                WHERE table_schema = 'public'
                    AND table_name = 'borrowers'
                    AND constraint_name = 'borrowers_user_id_fkey'
            ) THEN
                ALTER TABLE borrowers
                ADD CONSTRAINT borrowers_user_id_fkey
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE SET NULL;
            END IF;
        END
        $$;
    `);

    await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS borrowers_user_id_unique
        ON borrowers(user_id)
        WHERE user_id IS NOT NULL;
    `);

    await pool.query(`
        INSERT INTO borrowers (name, phone, address, user_id)
        SELECT u.name, NULL, NULL, u.id
        FROM users u
        WHERE u.role <> 'admin'
          AND NOT EXISTS (
              SELECT 1 FROM borrowers br WHERE br.user_id = u.id
          );
    `);

    await pool.query(`
        UPDATE books b
        SET inventory_status = CASE
            WHEN EXISTS (
                SELECT 1 FROM loans l
                WHERE l.book_id = b.id
                  AND l.status IN ('Dipinjam', 'Terlambat')
            ) THEN 'Dipinjam'
            WHEN EXISTS (
                SELECT 1 FROM loans l
                WHERE l.book_id = b.id
                  AND l.status = 'Dikembalikan'
                  AND l.return_condition = 'Rusak'
                  AND l.id = (SELECT MAX(latest.id) FROM loans latest WHERE latest.book_id = b.id)
            ) AND b.is_available = FALSE THEN 'Dalam perbaikan'
            WHEN EXISTS (
                SELECT 1 FROM loans l
                WHERE l.book_id = b.id
                  AND l.status = 'Dikembalikan'
                  AND l.return_condition = 'Hilang'
                  AND l.id = (SELECT MAX(latest.id) FROM loans latest WHERE latest.book_id = b.id)
            ) AND b.is_available = FALSE THEN 'Hilang'
            ELSE b.inventory_status
        END;
    `);

    await pool.query(`
        UPDATE books
        SET is_available = (inventory_status = 'Tersedia');
    `);
};

module.exports = ensureSchema;
