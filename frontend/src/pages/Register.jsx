import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card__intro">
          <span className="auth-card__eyebrow">Daftar Akun</span>
          <h2>Gabung ke MinjemDong</h2>
          <p>
            Buat akun untuk mulai melihat koleksi, mencatat peminjaman, dan
            mengelola kebutuhan perpustakaan dalam satu sistem.
          </p>
        </div>

        <Form className="auth-form">
          <Form.Group className="mb-3" controlId="registerName">
            <Form.Label>Nama Lengkap</Form.Label>
            <Form.Control type="text" placeholder="Masukkan nama lengkap" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="nama@email.com" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Buat password" />
          </Form.Group>

          <Button type="submit" className="auth-button">
            Register
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