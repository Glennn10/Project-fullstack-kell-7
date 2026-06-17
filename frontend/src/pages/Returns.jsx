import { useState } from 'react';
import { Container, Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Loans.css'; // Reusing loans CSS for consistent header padding/styling

const MOCK_ACTIVE_LOANS = [
  { id: 1, borrowerName: 'Budi Santoso', bookTitle: 'Ensiklopedia Anak Cerdas: Olahraga', loanDate: '2023-10-01', dueDate: '2023-10-08', status: 'borrowed' },
  { id: 2, borrowerName: 'Siti Rahma', bookTitle: 'Harry Potter and the Order of the Phoenix', loanDate: '2023-10-05', dueDate: '2023-10-12', status: 'borrowed' },
];

const Returns = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loans, setLoans] = useState(MOCK_ACTIVE_LOANS);

  const handleReturn = (id) => {
    // In a real app, this would call the backend
    setLoans(loans.map(loan => 
      loan.id === id ? { ...loan, status: 'returned' } : loan
    ));
    alert('Buku berhasil dikembalikan secara lokal (Mode Demo)!');
  };

  const filteredLoans = loans.filter(loan => 
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="loan-container">
      <Container>
        {/* Section Header */}
        <header className="loan-header-section mb-4">
          <Badge bg="success" text="light" className="loan-badge mb-2">
            Pengembalian Buku
          </Badge>
          <h1 className="loan-title">Daftar Peminjaman Aktif</h1>
          <p className="loan-subtitle">
            Cari data peminjam dan proses pengembalian buku di halaman ini. (Data Dummy Frontend)
          </p>
        </header>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Cari nama peminjam atau judul buku..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary">Cari</Button>
            </InputGroup>

            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID Pinjam</th>
                    <th>Nama Peminjam</th>
                    <th>Judul Buku</th>
                    <th>Tgl Pinjam</th>
                    <th>Tenggat Waktu</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td>#{loan.id}</td>
                        <td className="fw-semibold">{loan.borrowerName}</td>
                        <td>{loan.bookTitle}</td>
                        <td>{loan.loanDate}</td>
                        <td>{loan.dueDate}</td>
                        <td>
                          {loan.status === 'borrowed' ? (
                            <Badge bg="warning" text="dark">Dipinjam</Badge>
                          ) : (
                            <Badge bg="success">Dikembalikan</Badge>
                          )}
                        </td>
                        <td>
                          <Button 
                            variant="success" 
                            size="sm" 
                            disabled={loan.status === 'returned'}
                            onClick={() => handleReturn(loan.id)}
                          >
                            {loan.status === 'returned' ? 'Selesai' : 'Kembalikan'}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        Tidak ada data peminjaman yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Returns;
