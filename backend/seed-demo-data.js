const pool = require('./src/config/db');
const bcrypt = require('bcrypt');

// ─── USERS ────────────────────────────────────────────────────────────────────
const demoUsers = [
  { name: 'Administrator',  email: 'admin@minjemdong.com',  password: 'adminpassword123', role: 'admin' },
  { name: 'User Demo',      email: 'user@minjemdong.com',   password: 'userpassword123',  role: 'user',  phone: '081234567890', address: 'Jakarta' },
  { name: 'Budi Santoso',   email: 'budi@minjemdong.com',   password: 'demo123',          role: 'user',  phone: '082198765432', address: 'Bandung' },
  { name: 'Siti Rahayu',    email: 'siti@minjemdong.com',   password: 'demo123',          role: 'user',  phone: '085611223344', address: 'Surabaya' },
  { name: 'Andi Pratama',   email: 'andi@minjemdong.com',   password: 'demo123',          role: 'user',  phone: '087711223344', address: 'Yogyakarta' },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const demoCategories = [
  { name: 'Fiksi' },
  { name: 'Non-Fiksi' },
  { name: 'Sains & Teknologi' },
  { name: 'Sejarah' },
  { name: 'Biografi' },
  { name: 'Filsafat' },
  { name: 'Ekonomi & Bisnis' },
];

// ─── BOOKS (category resolved by name) ───────────────────────────────────────
const demoBooks = [
  // Fiksi
  { title: 'Laskar Pelangi', author: 'Andrea Hirata', publisher: 'Bentang Pustaka', year: 2005, category: 'Fiksi' },
  { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', publisher: 'Lentera Dipantara', year: 1980, category: 'Fiksi' },
  { title: 'Perahu Kertas', author: 'Dee Lestari', publisher: 'Bentang Pustaka', year: 2009, category: 'Fiksi' },
  { title: 'Negeri 5 Menara', author: 'Ahmad Fuadi', publisher: 'Gramedia', year: 2009, category: 'Fiksi' },
  { title: 'Ayah', author: 'Andrea Hirata', publisher: 'Bentang Pustaka', year: 2015, category: 'Fiksi' },
  { title: 'Cantik Itu Luka', author: 'Eka Kurniawan', publisher: 'Gramedia', year: 2002, category: 'Fiksi' },

  // Non-Fiksi
  { title: 'Sebuah Seni untuk Bersikap Bodo Amat', author: 'Mark Manson', publisher: 'Gramedia', year: 2017, category: 'Non-Fiksi' },
  { title: 'Atomic Habits', author: 'James Clear', publisher: 'Penguin Books', year: 2018, category: 'Non-Fiksi' },
  { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', publisher: 'Simon & Schuster', year: 1989, category: 'Non-Fiksi' },
  { title: 'Deep Work', author: 'Cal Newport', publisher: 'Grand Central', year: 2016, category: 'Non-Fiksi' },

  // Sains & Teknologi
  { title: 'A Brief History of Time', author: 'Stephen Hawking', publisher: 'Bantam Books', year: 1988, category: 'Sains & Teknologi' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', publisher: 'Harper Collins', year: 2011, category: 'Sains & Teknologi' },
  { title: 'The Code Book', author: 'Simon Singh', publisher: 'Doubleday', year: 1999, category: 'Sains & Teknologi' },
  { title: 'Clean Code', author: 'Robert C. Martin', publisher: 'Prentice Hall', year: 2008, category: 'Sains & Teknologi' },

  // Sejarah
  { title: 'Sejarah Indonesia Modern 1200–2004', author: 'M.C. Ricklefs', publisher: 'Serambi', year: 2008, category: 'Sejarah' },
  { title: 'Perang Diponegoro', author: 'Peter Carey', publisher: 'KPG', year: 2008, category: 'Sejarah' },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', publisher: 'Norton', year: 1997, category: 'Sejarah' },

  // Biografi
  { title: 'Steve Jobs', author: 'Walter Isaacson', publisher: 'Simon & Schuster', year: 2011, category: 'Biografi' },
  { title: 'Elon Musk: Tesla, SpaceX, dan Pencarian Masa Depan', author: 'Ashlee Vance', publisher: 'Ecco', year: 2015, category: 'Biografi' },
  { title: 'Soekarno: An Autobiography', author: 'Cindy Adams', publisher: 'Gunung Agung', year: 1965, category: 'Biografi' },

  // Filsafat
  { title: 'Meditations', author: 'Marcus Aurelius', publisher: 'Penguin Classics', year: 180, category: 'Filsafat' },
  { title: 'Thus Spoke Zarathustra', author: 'Friedrich Nietzsche', publisher: 'Penguin Classics', year: 1883, category: 'Filsafat' },

  // Ekonomi & Bisnis
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', publisher: 'Warner Books', year: 1997, category: 'Ekonomi & Bisnis' },
  { title: 'The Lean Startup', author: 'Eric Ries', publisher: 'Crown Business', year: 2011, category: 'Ekonomi & Bisnis' },
  { title: 'Zero to One', author: 'Peter Thiel', publisher: 'Crown Business', year: 2014, category: 'Ekonomi & Bisnis' },
];

// ─── LOANS TEMPLATE ───────────────────────────────────────────────────────────
// Will be built after books & borrowers are inserted
// Format: { bookTitle, borrowerEmail, loanDate, returnDate, status }
const demoLoans = [
  { bookTitle: 'Laskar Pelangi',          borrowerEmail: 'user@minjemdong.com',  loanDate: '2026-05-01', returnDate: '2026-05-10', status: 'Dikembalikan' },
  { bookTitle: 'Atomic Habits',           borrowerEmail: 'budi@minjemdong.com',  loanDate: '2026-05-05', returnDate: '2026-05-14', status: 'Dikembalikan' },
  { bookTitle: 'Sapiens',                 borrowerEmail: 'siti@minjemdong.com',  loanDate: '2026-05-10', returnDate: null,         status: 'Dipinjam'     },
  { bookTitle: 'Steve Jobs',              borrowerEmail: 'andi@minjemdong.com',  loanDate: '2026-05-12', returnDate: null,         status: 'Dipinjam'     },
  { bookTitle: 'Bumi Manusia',            borrowerEmail: 'user@minjemdong.com',  loanDate: '2026-05-15', returnDate: '2026-05-22', status: 'Dikembalikan' },
  { bookTitle: 'Clean Code',              borrowerEmail: 'budi@minjemdong.com',  loanDate: '2026-05-20', returnDate: null,         status: 'Terlambat'    },
  { bookTitle: 'Rich Dad Poor Dad',       borrowerEmail: 'siti@minjemdong.com',  loanDate: '2026-06-01', returnDate: '2026-06-08', status: 'Dikembalikan' },
  { bookTitle: 'Deep Work',               borrowerEmail: 'andi@minjemdong.com',  loanDate: '2026-06-05', returnDate: null,         status: 'Dipinjam'     },
  { bookTitle: 'Perahu Kertas',           borrowerEmail: 'user@minjemdong.com',  loanDate: '2026-06-08', returnDate: null,         status: 'Dipinjam'     },
  { bookTitle: 'A Brief History of Time', borrowerEmail: 'budi@minjemdong.com',  loanDate: '2026-06-10', returnDate: null,         status: 'Dipinjam'     },
  { bookTitle: 'Meditations',             borrowerEmail: 'siti@minjemdong.com',  loanDate: '2026-06-12', returnDate: null,         status: 'Dipinjam'     },
  { bookTitle: 'Zero to One',             borrowerEmail: 'andi@minjemdong.com',  loanDate: '2026-04-01', returnDate: '2026-04-12', status: 'Dikembalikan' },
  { bookTitle: 'Negeri 5 Menara',         borrowerEmail: 'user@minjemdong.com',  loanDate: '2026-04-05', returnDate: '2026-04-15', status: 'Dikembalikan' },
  { bookTitle: 'Guns, Germs, and Steel',  borrowerEmail: 'budi@minjemdong.com',  loanDate: '2026-04-10', returnDate: '2026-04-20', status: 'Dikembalikan' },
  { bookTitle: 'The Lean Startup',        borrowerEmail: 'siti@minjemdong.com',  loanDate: '2026-05-18', returnDate: null,         status: 'Terlambat'    },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
async function upsertUser(user) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [user.email]);

  if (existing.rows.length > 0) {
    const res = await pool.query(
      'UPDATE users SET name=$1, password=$2, role=$3 WHERE email=$4 RETURNING id, name, email, role',
      [user.name, hashedPassword, user.role, user.email],
    );
    return res.rows[0];
  }

  const res = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role',
    [user.name, user.email, hashedPassword, user.role],
  );
  return res.rows[0];
}

async function upsertBorrower(user, createdUser) {
  if (user.role === 'admin') return null;

  const res = await pool.query(
    `INSERT INTO borrowers (name, phone, address, user_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id) WHERE user_id IS NOT NULL
     DO UPDATE SET name=EXCLUDED.name, phone=EXCLUDED.phone, address=EXCLUDED.address
     RETURNING id`,
    [user.name, user.phone ?? null, user.address ?? null, createdUser.id],
  );
  return res.rows[0].id;
}

async function upsertCategory(name) {
  const existing = await pool.query('SELECT id FROM categories WHERE name = $1', [name]);
  if (existing.rows.length > 0) return existing.rows[0].id;

  const res = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [name]);
  return res.rows[0].id;
}

async function upsertBook(book, categoryId) {
  const existing = await pool.query(
    'SELECT id FROM books WHERE title = $1 AND author = $2',
    [book.title, book.author],
  );
  if (existing.rows.length > 0) return existing.rows[0].id;

  const res = await pool.query(
    'INSERT INTO books (title, author, publisher, year, category_id) VALUES ($1,$2,$3,$4,$5) RETURNING id',
    [book.title, book.author, book.publisher, book.year, categoryId],
  );
  return res.rows[0].id;
}

async function insertLoan({ bookId, borrowerId, userId, loanDate, returnDate, status }) {
  const existing = await pool.query(
    'SELECT id FROM loans WHERE book_id=$1 AND borrower_id=$2 AND loan_date=$3',
    [bookId, borrowerId, loanDate],
  );
  if (existing.rows.length > 0) {
    console.log(`  ↩ pinjaman sudah ada (book_id=${bookId}, borrower_id=${borrowerId})`);
    return;
  }

  const dueDate = new Date(loanDate);
  dueDate.setDate(dueDate.getDate() + 14);

  await pool.query(
    `INSERT INTO loans (book_id, borrower_id, user_id, loan_date, due_date, return_date, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [bookId, borrowerId, userId, loanDate, dueDate.toISOString().slice(0, 10), returnDate, status],
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function seedAll() {
  console.log('🌱  Memulai seeding data demo...\n');

  // 1. Users
  console.log('👤  Menyiapkan users...');
  const userMap = {}; // email -> { id, borrowerId }
  for (const u of demoUsers) {
    const created = await upsertUser(u);
    const borrowerId = await upsertBorrower(u, created);
    userMap[u.email] = { id: created.id, borrowerId };
    console.log(`  ✓ ${u.role.padEnd(5)} | ${u.email}`);
  }

  // 2. Categories
  console.log('\n📂  Menyiapkan kategori...');
  const catMap = {}; // name -> id
  for (const cat of demoCategories) {
    catMap[cat.name] = await upsertCategory(cat.name);
    console.log(`  ✓ ${cat.name}`);
  }

  // 3. Books
  console.log('\n📚  Menyiapkan buku...');
  const bookMap = {}; // title -> id
  for (const book of demoBooks) {
    const catId = catMap[book.category];
    const bookId = await upsertBook(book, catId);
    bookMap[book.title] = bookId;
    console.log(`  ✓ "${book.title}" [${book.category}]`);
  }

  // 4. Loans
  console.log('\n📋  Menyiapkan peminjaman...');
  for (const loan of demoLoans) {
    const bookId = bookMap[loan.bookTitle];
    const borrowerInfo = userMap[loan.borrowerEmail];
    if (!bookId || !borrowerInfo?.borrowerId) {
      console.warn(`  ⚠ Skip pinjaman: buku/peminjam tidak ditemukan (${loan.bookTitle} / ${loan.borrowerEmail})`);
      continue;
    }
    await insertLoan({
      bookId,
      borrowerId: borrowerInfo.borrowerId,
      userId: borrowerInfo.id,
      loanDate:   loan.loanDate,
      returnDate: loan.returnDate,
      status:     loan.status,
    });
    console.log(`  ✓ "${loan.bookTitle}" ← ${loan.borrowerEmail} [${loan.status}]`);
  }

  // 5. Update book & inventory status
  console.log('\n🔄  Update status buku & inventaris...');
  await pool.query(`
    UPDATE books b
    SET inventory_status = CASE
      WHEN EXISTS (
        SELECT 1 FROM loans l
        WHERE l.book_id = b.id AND l.status IN ('Dipinjam', 'Terlambat')
      ) THEN 'Dipinjam'
      ELSE 'Tersedia'
    END
  `);
  await pool.query(`UPDATE books SET is_available = (inventory_status = 'Tersedia')`);

  console.log('\n✅  Seeding selesai!\n');
  console.log('═══════════════════════════════════════════════');
  console.log('  AKUN DEMO LOGIN');
  console.log('═══════════════════════════════════════════════');
  console.log('  ADMIN');
  console.log('  Email    : admin@minjemdong.com');
  console.log('  Password : adminpassword123');
  console.log('───────────────────────────────────────────────');
  console.log('  USER (4 akun)');
  for (const u of demoUsers.filter(u => u.role === 'user')) {
    console.log(`  ${u.name.padEnd(15)} | ${u.email} | ${u.password}`);
  }
  console.log('═══════════════════════════════════════════════');
}

seedAll()
  .catch(e => { console.error('\n❌  Error:', e.message); process.exit(1); })
  .finally(() => pool.end());
