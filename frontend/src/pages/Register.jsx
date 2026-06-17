import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(apiUrl('/api/auth/register'), formData);
      navigate('/login', {
        replace: true,
        state: { message: 'Registrasi berhasil. Silakan login.' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__intro">
          <span className="auth-card__eyebrow">Daftar Akun</span>
          <h2>Gabung ke MinjemDong</h2>
          <p>Buat akun untuk mulai melihat koleksi, mencatat peminjaman, dan mengelola kebutuhan perpustakaan.</p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form className="auth-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="registerName">
            <Form.Label>Nama Lengkap</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Buat password"
              minLength={6}
              required
            />
          </Form.Group>

          <Button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Memproses
              </>
            ) : (
              'Register'
            )}
          </Button>

          <p className="auth-form__switch">
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    </section>
  );
};

export default Register;
