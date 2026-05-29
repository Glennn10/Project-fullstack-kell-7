import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/index'; // Import halaman Home yang baru aja kita bikin
import Books from './pages/Books'; // Import halaman Katalog Buku
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </Layout>
  );
}

export default App;