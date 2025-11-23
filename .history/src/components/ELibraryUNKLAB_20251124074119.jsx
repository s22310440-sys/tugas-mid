import React, { useState, useEffect } from "react";
import { getBooks, submitLoan, API_KEY } from "../api/config";

export default function ELibraryUNKLAB() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [fine, setFine] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const dailyFine = 7500;

  // Load books dari API saat component mount
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      // Set buku statis dengan nama yang diinginkan
      setBooks([
        { id: 1, title: "Buku Skripsi", stock: 10 },
        { id: 2, title: "Buku Agama", stock: 10 },
        { id: 3, title: "Buku Kamus", stock: 10 },
      ]);
      setLoading(false);
    };

    loadBooks();
  }, []);

  const calculateFine = () => {
    if (!borrowDate || !returnDate) return;

    const start = new Date(borrowDate);
    const end = new Date(returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      const lateDays = diffDays - 7;
      setFine(lateDays * dailyFine);
    } else {
      setFine(0);
    }
  };

  useEffect(() => {
    calculateFine();
  }, [borrowDate, returnDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook) {
      setMessage("Silakan pilih buku terlebih dahulu.");
      return;
    }

    if (!borrowDate || !returnDate) {
      setMessage("Silakan isi tanggal peminjaman dan pengembalian.");
      return;
    }

    setLoading(true);

    // Kirim data ke API
    const loanData = {
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      borrowDate,
      returnDate,
      fine,
      timestamp: new Date().toISOString(),
    };

    const result = await submitLoan(loanData);

    if (result.success) {
      setMessage(
        `✓ Peminjaman berhasil! Buku: ${selectedBook.title}. Denda keterlambatan: Rp ${fine}. Data disimpan di server.`
      );
      // Reset form
      setTimeout(() => {
        setSelectedBook(null);
        setBorrowDate("");
        setReturnDate("");
        setFine(0);
      }, 2000);
    } else {
      setMessage(
        `✓ Peminjaman tercatat lokal! Buku: ${selectedBook.title}. Denda: Rp ${fine}. (Server sedang offline)`
      );
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">📚 E-Library UNKLAB</h1>
      <p className="subtitle">Sistem Peminjaman Buku Digital</p>

      <div className="card">
        <h2>Pilih Buku</h2>

        {loading && books.length === 0 ? (
          <p className="info-box">Memuat data buku dari server...</p>
        ) : (
          <div className="book-list">
            {books.map((book) => (
              <button
                key={book.id}
                className={`book-btn ${
                  selectedBook?.id === book.id ? "active" : ""
                }`}
                onClick={() => setSelectedBook(book)}
                disabled={loading}
              >
                {book.title}
                <br />
                <small>Stok: {book.stock}</small>
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tanggal Peminjaman</label>
            <input
              type="date"
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tanggal Pengembalian</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>

          <div className="fine-box">
            <strong>💰 Estimasi Denda:</strong> Rp {fine.toLocaleString("id-ID")}
            {fine > 0 && <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
              *Denda berlaku jika melebihi 7 hari peminjaman
            </p>}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Memproses..." : "Konfirmasi Peminjaman"}
          </button>
        </form>

        {message && (
          <div className="result">
            {message}
          </div>
        )}

        <div className="card-footer">
          <small style={{ color: "#666" }}>
            🔗 API Status: Connected (Using JSONPlaceholder Demo API)
            <br />
            🔑 API Key: {API_KEY}
          </small>
        </div>
      </div>
    </div>
  );
}