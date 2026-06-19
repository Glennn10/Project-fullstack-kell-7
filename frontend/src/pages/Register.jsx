import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AuthShowcase from '../components/auth/AuthShowcase';
import { authService } from '../services/authService';
import '../styles/pages/auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password belum sama.');
      return;
    }
    setLoading(true);

    try {
      await authService.register({ name: formData.name, email: formData.email, phone: formData.phone, address: formData.address, password: formData.password });
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
      <div className="auth-shell auth-shell--register">
        <AuthShowcase variant="register" />
        <div className="auth-card">
          <div className="auth-card__index"><span>FORMULIR ANGGOTA</span><strong>02</strong></div>
          <div className="auth-card__intro">
            <span className="auth-card__eyebrow">Kartu pertamamu</span>
            <h2>Daftar jadi pembaca.</h2>
            <p>Isi data singkat ini, lalu rak perpustakaan terbuka untukmu.</p>
          </div>

          {error && <Alert variant="danger" className="auth-alert">{error}</Alert>}

          <Form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__identity-grid">
              <Form.Group controlId="registerName"><Form.Label>Nama lengkap</Form.Label><div className="auth-field"><FiUser /><Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama di kartu" autoComplete="name" required /></div></Form.Group>
              <Form.Group controlId="registerPhone"><Form.Label>Nomor HP</Form.Label><div className="auth-field"><FiPhone /><Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" autoComplete="tel" inputMode="tel" required /></div></Form.Group>
            </div>

            <Form.Group controlId="registerEmail"><Form.Label>Email aktif</Form.Label><div className="auth-field"><FiMail /><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="nama@email.com" autoComplete="email" required /></div></Form.Group>

            <Form.Group controlId="registerAddress"><Form.Label>Alamat</Form.Label><div className="auth-field"><FiMapPin /><Form.Control type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Alamat tempat tinggal" autoComplete="street-address" required /></div></Form.Group>

            <div className="auth-form__password-grid">
              <Form.Group controlId="registerPassword"><Form.Label>Password</Form.Label><div className="auth-field"><FiLock /><Form.Control type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Minimal 6 karakter" autoComplete="new-password" minLength={6} required /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div></Form.Group>
              <Form.Group controlId="registerConfirmPassword"><Form.Label>Ulangi password</Form.Label><div className="auth-field"><FiLock /><Form.Control type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Ketik sekali lagi" autoComplete="new-password" minLength={6} required /></div></Form.Group>
            </div>

            <Button type="submit" className="auth-button" disabled={loading}>{loading ? <><Spinner animation="border" size="sm" /> Menyiapkan kartu...</> : <>Daftar sekarang <FiArrowRight /></>}</Button>

            <p className="auth-form__switch">Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
          </Form>
          <div className="auth-card__stamp" aria-hidden="true"><span>ANGGOTA</span><strong>BARU</strong><small>WELCOME!</small></div>
        </div>
      </div>
    </section>
  );
};

export default Register;
