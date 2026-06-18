import { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiSearch, FiTag, FiTrash2, FiX } from 'react-icons/fi';
import DashboardShell from '../components/dashboard/DashboardShell';
import DeskStationery from '../components/dashboard/DeskStationery';
import { useAuth } from '../context/useAuth';
import { categoryPalette } from '../data/catalogData';
import { libraryService } from '../services/libraryService';
import '../styles/pages/dashboard.css';
import '../styles/pages/manage-categories.css';

const ManageCategories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadCategories = async () => {
    const response = await libraryService.getCategories();
    setCategories(response.data?.data || []);
  };

  useEffect(() => {
    let isCurrent = true;
    libraryService.getCategories()
      .then((response) => { if (isCurrent) setCategories(response.data?.data || []); })
      .catch((requestError) => { if (isCurrent) setError(requestError.response?.data?.message || 'Kategori belum bisa dimuat.'); })
      .finally(() => { if (isCurrent) setLoading(false); });
    return () => { isCurrent = false; };
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword ? categories.filter((category) => category.name.toLowerCase().includes(keyword)) : categories;
  }, [categories, query]);

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingCategory(null);
    setName('');
  };

  const openCreate = () => {
    closeEditor();
    setEditorOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setEditorOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingCategory) {
        await libraryService.updateCategory(editingCategory.id, { name: name.trim() }, token);
        setFeedback('Nama kategori sudah diperbarui.');
      } else {
        await libraryService.createCategory({ name: name.trim() }, token);
        setFeedback('Rak kategori baru sudah dibuat.');
      }
      closeEditor();
      await loadCategories();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Kategori gagal disimpan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await libraryService.deleteCategory(deleteTarget.id, token);
      setFeedback(`Kategori “${deleteTarget.name}” sudah dihapus.`);
      setDeleteTarget(null);
      await loadCategories();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Kategori gagal dihapus.');
      setDeleteTarget(null);
    }
  };

  return (
    <DashboardShell note="Kategori yang jelas membantu pembaca menemukan raknya lebih cepat.">
      <header className="category-admin-masthead">
        <div><span>Lemari indeks</span><h1>Kelompokkan buku,<br />rapikan raknya.</h1><p>Satu kategori baru akan langsung menjadi rak baru di katalog publik.</p></div>
        <button type="button" onClick={openCreate}><FiPlus /> Tambah kategori</button>
        <DeskStationery items={['writing-tools', 'clips', 'stapler']} className="category-admin-stationery" />
      </header>

      <section className="category-admin-toolbar">
        <label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama kategori..." /></label>
        <p><strong>{filteredCategories.length}</strong> kategori tersimpan</p>
      </section>

      {feedback && <div className="inventory-feedback">{feedback}<button type="button" onClick={() => setFeedback('')}><FiX /></button></div>}
      {error && <div className="inventory-error"><FiTag /> {error}</div>}
      {loading && <div className="dashboard-state"><i /> Membuka lemari indeks...</div>}

      {!loading && (
        <section className="category-admin-grid">
          {filteredCategories.map((category, index) => {
            const count = Number(category.book_count || 0);
            const color = categoryPalette[index % categoryPalette.length];
            return (
              <article className="category-index-card" style={{ '--category-admin-color': color }} key={category.id}>
                <header><span>Indeks {String(index + 1).padStart(2, '0')}</span><small>{count} buku</small></header>
                <div className="category-index-card__shelf" aria-hidden="true">
                  {Array.from({ length: Math.min(6, Math.max(count, count ? 3 : 0)) }, (_, bookIndex) => (
                    <i key={`${category.id}-${bookIndex}`} style={{ '--index-spine': categoryPalette[(index + bookIndex) % categoryPalette.length], '--index-height': `${58 + ((bookIndex * 17) % 38)}%` }} />
                  ))}
                  {count === 0 && <em>rak kosong</em>}
                </div>
                <div className="category-index-card__name"><FiTag /><h2>{category.name}</h2></div>
                <footer>
                  <button type="button" onClick={() => openEdit(category)}><FiEdit2 /> Ubah nama</button>
                  <button type="button" disabled={count > 0} title={count > 0 ? 'Pindahkan buku dari kategori ini sebelum menghapusnya' : 'Hapus kategori'} onClick={() => setDeleteTarget(category)}><FiTrash2 /></button>
                </footer>
              </article>
            );
          })}
          {filteredCategories.length === 0 && <div className="dashboard-blank category-admin-empty"><FiTag /><span>Belum ada kategori yang cocok.</span><small>Tambahkan kategori atau ubah pencarianmu.</small></div>}
        </section>
      )}

      {editorOpen && (
        <div className="category-editor-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}>
          <form className="category-editor" onSubmit={handleSubmit}>
            <button type="button" onClick={closeEditor} aria-label="Tutup"><FiX /></button>
            <FiTag aria-hidden="true" />
            <span>{editingCategory ? 'Perbarui indeks' : 'Indeks baru'}</span>
            <h2>{editingCategory ? 'Ubah nama kategori' : 'Buat kategori baru'}</h2>
            <label>Nama kategori<input autoFocus required maxLength="80" value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Sains & Teknologi" /></label>
            <button type="submit" disabled={submitting || !name.trim()}>{submitting ? 'Menyimpan...' : editingCategory ? 'Simpan perubahan' : 'Buat kategori'}</button>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="category-editor-backdrop">
          <div className="category-delete-dialog"><FiTrash2 /><span>Hapus kategori kosong?</span><h2>{deleteTarget.name}</h2><p>Kategori yang sudah dihapus tidak bisa dikembalikan.</p><div><button type="button" onClick={() => setDeleteTarget(null)}>Batal</button><button type="button" onClick={handleDelete}>Hapus</button></div></div>
        </div>
      )}
    </DashboardShell>
  );
};

export default ManageCategories;
