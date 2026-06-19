import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertTriangle,
  FiBookOpen,
  FiEdit2,
  FiPlus,
  FiSave,
  FiSearch,
  FiTrash2,
  FiTool,
  FiUpload,
  FiX,
} from 'react-icons/fi';
import BookVolume from '../components/common/BookVolume';
import CustomSelect from '../components/common/CustomSelect';
import DashboardShell from '../components/dashboard/DashboardShell';
import DeskStationery from '../components/dashboard/DeskStationery';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/useAuth';
import { libraryService } from '../services/libraryService';
import '../styles/pages/dashboard.css';
import '../styles/pages/manage-books.css';

const emptyForm = { title: '', author: '', publisher: '', year: '', category_id: '' };

const getCoverUrl = (coverImage) => {
  if (!coverImage) return null;
  if (/^https?:\/\//i.test(coverImage)) return coverImage;
  return `${API_BASE_URL}/uploads/${coverImage.replace(/^\/?uploads\//, '')}`;
};

const ManageBooks = () => {
  const { token } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [statusChoice, setStatusChoice] = useState('Tersedia');

  const loadInventory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bookResponse, categoryResponse] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getCategories(),
      ]);
      setBooks(bookResponse.data?.data || []);
      setCategories(categoryResponse.data?.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Inventaris belum bisa dimuat.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;

    Promise.all([libraryService.getBooks(), libraryService.getCategories()])
      .then(([bookResponse, categoryResponse]) => {
        if (!isCurrent) return;
        setBooks(bookResponse.data?.data || []);
        setCategories(categoryResponse.data?.data || []);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.response?.data?.message || 'Inventaris belum bisa dimuat.');
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => { isCurrent = false; };
  }, []);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [String(category.id), category.name])),
    [categories],
  );

  const filteredBooks = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return books;
    return books.filter((book) => [book.title, book.author, book.publisher, categoryNames.get(String(book.category_id))]
      .some((value) => value?.toLowerCase().includes(keyword)));
  }, [books, categoryNames, query]);

  const closeEditor = () => {
    if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setEditorOpen(false);
    setEditingBook(null);
    setForm(emptyForm);
    setCoverFile(null);
    setCoverPreview(null);
  };

  const openCreate = () => {
    closeEditor();
    setEditorOpen(true);
  };

  const openEdit = (book) => {
    closeEditor();
    setEditingBook(book);
    setForm({
      title: book.title || '', author: book.author || '', publisher: book.publisher || '',
      year: book.year || '', category_id: book.category_id || '',
    });
    setCoverPreview(getCoverUrl(book.cover_image));
    setEditorOpen(true);
  };

  const handleCover = (event) => {
    const file = event.target.files?.[0] || null;
    if (coverPreview?.startsWith('blob:')) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(file ? URL.createObjectURL(file) : getCoverUrl(editingBook?.cover_image));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.category_id) {
      setError('Kategori wajib dipilih sebelum buku disimpan.');
      return;
    }
    setSubmitting(true);
    setError('');

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (coverFile) payload.append('cover_image', coverFile);

    try {
      if (editingBook) {
        await libraryService.updateBook(editingBook.id, payload, token);
        setFeedback('Perubahan buku sudah disimpan.');
      } else {
        await libraryService.createBook(payload, token);
        setFeedback('Buku baru sudah masuk inventaris.');
      }
      closeEditor();
      await loadInventory();
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.response?.data?.message || 'Buku gagal disimpan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await libraryService.deleteBook(deleteTarget.id, token);
      setFeedback(`“${deleteTarget.title}” sudah dihapus.`);
      setDeleteTarget(null);
      await loadInventory();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Buku gagal dihapus.');
    }
  };

  const openStatus = (book) => {
    setStatusTarget(book);
    setStatusChoice(book.inventory_status || (book.is_available === false ? 'Dipinjam' : 'Tersedia'));
  };

  const handleStatusUpdate = async () => {
    if (!statusTarget) return;
    try {
      await libraryService.updateBookStatus(statusTarget.id, { inventory_status: statusChoice }, token);
      setFeedback(`Status “${statusTarget.title}” sekarang ${statusChoice.toLowerCase()}.`);
      setStatusTarget(null);
      await loadInventory();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Status buku gagal diperbarui.');
    }
  };

  return (
    <DashboardShell note="Sampul dan kategori yang rapi bikin katalog lebih gampang dijelajahi.">
      <header className="inventory-masthead">
        <div><span>Meja inventaris</span><h1>Kelola koleksi<br />tanpa ribet.</h1><p>Tambah, rapikan, dan perbarui buku yang tampil di katalog.</p></div>
        <button type="button" onClick={openCreate}><FiPlus /> Tambah buku</button>
        <DeskStationery items={['ruler', 'highlighter', 'clips']} className="inventory-stationery" />
      </header>

      <section className="inventory-toolbar">
        <label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari judul, penulis, penerbit..." /></label>
        <div><strong>{filteredBooks.length}</strong><span>dari {books.length} buku</span></div>
      </section>

      {feedback && <div className="inventory-feedback">{feedback}<button type="button" onClick={() => setFeedback('')}><FiX /></button></div>}
      {error && <div className="inventory-error"><FiAlertTriangle /> {error}</div>}
      {loading && <div className="dashboard-state"><i /> Membuka inventaris...</div>}

      {!loading && (
        <section className="inventory-ledger">
          <header><span>Daftar Buku</span><div><strong>Judul & penulis</strong><strong>Kategori</strong><strong>Terbit</strong><strong>Status</strong><strong>Aksi</strong></div></header>
          {filteredBooks.length > 0 ? filteredBooks.map((book) => (
            <article className="inventory-row" key={book.id}>
              <BookVolume cover={getCoverUrl(book.cover_image)} title={book.title} className="inventory-mini-book" />
              <div className="inventory-row__identity"><strong>{book.title}</strong><span>{book.author || 'Penulis belum dicatat'}</span><small>{book.publisher || 'Penerbit belum dicatat'}</small></div>
              <span className="inventory-row__category">{categoryNames.get(String(book.category_id)) || 'Tanpa kategori'}</span>
              <time>{book.year || '—'}</time>
              <span className={`inventory-row__status is-${(book.inventory_status || (book.is_available === false ? 'Dipinjam' : 'Tersedia')).toLowerCase().replaceAll(' ', '-')}`}><i />{book.inventory_status || (book.is_available === false ? 'Dipinjam' : 'Tersedia')}</span>
              <div className="inventory-row__actions">
                <button type="button" disabled={(book.inventory_status || '') === 'Dipinjam'} onClick={() => openStatus(book)} aria-label={`Ubah status ${book.title}`} title={(book.inventory_status || '') === 'Dipinjam' ? 'Selesaikan melalui Pengembalian' : 'Ubah status inventaris'}><FiTool /></button>
                <button type="button" onClick={() => openEdit(book)} aria-label={`Edit ${book.title}`}><FiEdit2 /></button>
                <button type="button" onClick={() => setDeleteTarget(book)} aria-label={`Hapus ${book.title}`}><FiTrash2 /></button>
              </div>
            </article>
          )) : <div className="dashboard-blank"><FiBookOpen /><span>Nggak ada buku yang cocok.</span><small>Coba kata pencarian lain atau tambah buku baru.</small></div>}
        </section>
      )}

      {editorOpen && (
        <div
          className="inventory-editor-backdrop"
          role="presentation"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}
        >
          <aside className="inventory-editor" role="dialog" aria-modal="true" aria-labelledby="inventory-editor-title" onMouseDown={(event) => event.stopPropagation()}>
            <header>
              <div><h2 id="inventory-editor-title">{editingBook ? 'Edit buku' : 'Masukkan ke katalog'}</h2></div>
              <button type="button" className="inventory-editor__close" onClick={closeEditor} aria-label="Tutup editor"><FiX /></button>
            </header>
            <form onSubmit={handleSubmit}>
              <div className="inventory-cover-field">
                <BookVolume cover={coverPreview} title={form.title || 'Buku baru'} className="inventory-form-book" />
                <label><FiUpload /> {coverFile ? coverFile.name : 'Pilih sampul'}<input type="file" accept="image/*" onChange={handleCover} /></label>
              </div>
              <label>Judul buku<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
              <label>Penulis<input required value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} /></label>
              <div className="inventory-form-grid">
                <label>Penerbit<input required value={form.publisher} onChange={(event) => setForm({ ...form, publisher: event.target.value })} /></label>
                <label>Tahun<input required type="number" min="1000" max="2100" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} /></label>
              </div>
              <div className="inventory-field">
                <span>Kategori *</span>
                <CustomSelect
                  value={form.category_id}
                  onChange={(categoryId) => setForm({ ...form, category_id: categoryId })}
                  placeholder="Pilih kategori"
                  options={categories.map((category) => ({ value: category.id, label: category.name }))}
                />
              </div>
              <button className="inventory-save" type="submit" disabled={submitting || !form.category_id}><FiSave /> {submitting ? 'Menyimpan...' : 'Simpan buku'}</button>
            </form>
          </aside>
        </div>
      )}

      {statusTarget && (
        <div className="inventory-confirm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setStatusTarget(null); }}>
          <div className="inventory-status-dialog" role="dialog" aria-modal="true">
            <FiTool /><span>Status inventaris</span><h2>{statusTarget.title}</h2><p>Buku yang sedang diperbaiki atau hilang tidak akan muncul di pilihan Peminjaman.</p>
            <div className="inventory-status-options">
              {['Tersedia', 'Dalam perbaikan', 'Hilang'].map((status) => <button type="button" className={statusChoice === status ? 'is-selected' : ''} key={status} onClick={() => setStatusChoice(status)}><i />{status}</button>)}
            </div>
            <footer><button type="button" onClick={() => setStatusTarget(null)}>Batal</button><button type="button" onClick={handleStatusUpdate}>Simpan status</button></footer>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="inventory-confirm-backdrop">
          <div className="inventory-confirm" role="alertdialog" aria-modal="true"><FiAlertTriangle /><span>Hapus dari inventaris?</span><h2>{deleteTarget.title}</h2><p>Tindakan ini tidak bisa dibatalkan.</p><div><button type="button" onClick={() => setDeleteTarget(null)}>Batal</button><button type="button" onClick={handleDelete}>Ya, hapus</button></div></div>
        </div>
      )}
    </DashboardShell>
  );
};

export default ManageBooks;
