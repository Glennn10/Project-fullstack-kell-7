import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__intro">
          <span className="auth-card__eyebrow">Selamat Datang</span>
          <h2>Masuk ke MinjemDong</h2>
          <p>
            Akses dashboard perpustakaan untuk mengelola data buku, anggota,
            dan peminjaman dengan lebih praktis.
          </p>
        </div>

        <Form className="auth-form">
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="nama@email.com" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Masukkan password" />
          </Form.Group>

          <div className="auth-form__meta">
            <Form.Check type="checkbox" id="rememberMe" label="Ingat saya" />
            <Link to="/register">Buat akun</Link>
          </div>

          <Button type="submit" className="auth-button">
            Login
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default Login;