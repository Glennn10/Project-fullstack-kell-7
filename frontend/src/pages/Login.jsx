import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/useAuth';
import { apiUrl } from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const requestedPath = location.state?.from?.pathname;
  const successMessage = location.state?.message;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(apiUrl('/api/auth/login'), formData);
      const authData = response.data.data;
      const fallbackPath = authData.user.role === 'admin' ? '/dashboard' : '/books';
      const nextPath = requestedPath === '/dashboard' && authData.user.role !== 'admin'
        ? fallbackPath
        : (requestedPath || fallbackPath);

      login(authData);
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Pastikan email dan password benar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__intro">
          <span className="auth-card__eyebrow">Selamat Datang</span>
          <h2>Masuk ke MinjemDong</h2>
          <p>Akses dashboard perpustakaan untuk mengelola data buku, anggota, dan peminjaman.</p>
        </div>

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form className="auth-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
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

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              required
            />
          </Form.Group>

          <div className="auth-form__meta">
            <Form.Check type="checkbox" id="rememberMe" label="Ingat saya" />
            <Link to="/register">Buat akun</Link>
          </div>

          <Button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Memproses
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default Login;
