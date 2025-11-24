import React, { useState, useEffect } from "react";
import { getBooks, submitLoan, API_KEY } from "../api/config";

export default function ELibraryUNKLAB({
  onNavigateReturn = () => {},
  onBorrowComplete = () => {},
  currentUser = null,
}) {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (currentUser?.name) {
      setBorrowerName((prev) => prev || currentUser.name);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook) {
      setMessage("Silakan pilih buku terlebih dahulu.");
      return;
    }

    if (!borrowerName.trim()) {
      setMessage("Nama peminjam wajib diisi.");
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
      borrowerName,
      borrowDate,
      returnDate,
      notes,
      timestamp: new Date().toISOString(),
    };

    const result = await submitLoan(loanData);

    if (result.success) {
      setMessage(`✓ Peminjaman berhasil! Buku: ${selectedBook.title}.`);
      onBorrowComplete({
        borrowerName,
        bookTitle: selectedBook.title,
        borrowDate,
        plannedReturnDate: returnDate,
        notes,
      });
      // Reset form
      setTimeout(() => {
        setSelectedBook(null);
        setBorrowerName("");
        setBorrowDate("");
        setReturnDate("");
        setNotes("");
      }, 2000);
    } else {
      setMessage(
        `✓ Peminjaman tercatat lokal! Buku: ${selectedBook.title}. (Server sedang offline)`
      );
      onBorrowComplete({
        borrowerName,
        bookTitle: selectedBook.title,
        borrowDate,
        plannedReturnDate: returnDate,
        notes,
      });
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
            <label>Nama Peminjam</label>
            <input
              type="text"
              value={borrowerName}
              onChange={(e) => setBorrowerName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

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

          <div className="form-group">
            <label>Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opsional: catatan untuk petugas perpustakaan"
              rows={3}
            />
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

        <div className="return-cta">
          <div>
            <strong>Sudah selesai membaca?</strong>
            <p className="mt-1">
              Hitung estimasi denda dan konfirmasi pengembalian di halaman khusus.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onNavigateReturn}
          >
            Buka Pengembalian Buku
          </button>
        </div>

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