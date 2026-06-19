import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShowcase from '../components/auth/AuthShowcase';
import { useAuth } from '../context/useAuth';
import { authService } from '../services/authService';
import '../styles/pages/auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await authService.login(formData);
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
      <div className="auth-shell">
        <AuthShowcase variant="login" />
        <div className="auth-card">
          <div className="auth-card__index"><span>LEMBAR MASUK</span><strong>01</strong></div>
          <div className="auth-card__intro">
            <span className="auth-card__eyebrow">Halo lagi</span>
            <h2>Masuk ke akunmu.</h2>
            <p>Rak pribadimu masih seperti terakhir kali ditinggalkan.</p>
          </div>

          {successMessage && <Alert variant="success" className="auth-alert">{successMessage}</Alert>}
          {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

          <Form className="auth-form" onSubmit={handleSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label>Email</Form.Label>
              <div className="auth-field"><FiMail /><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" autoComplete="email" required /></div>
            </Form.Group>

            <Form.Group controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <div className="auth-field"><FiLock /><Form.Control type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Masukkan password" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
            </Form.Group>

            <div className="auth-form__meta"><span>Belum punya kartu anggota?</span><Link to="/register">Buat akun</Link></div>

            <Button type="submit" className="auth-button" disabled={loading}>{loading ? <><Spinner animation="border" size="sm" /> Memeriksa...</> : <>Masuk sekarang <FiArrowRight /></>}</Button>
          </Form>
          <div className="auth-card__stamp" aria-hidden="true"><span>BACA</span><strong>PINJAM</strong><small>ULANGI</small></div>
        </div>
      </div>
    </section>
  );
};

export default Login;
