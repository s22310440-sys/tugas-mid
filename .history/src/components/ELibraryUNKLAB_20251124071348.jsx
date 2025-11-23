import React, { useState, useEffect } from "react";
import { API_KEY } from "../api/config";

const books = [
  { id: 1, title: "Buku Skripsi", stock: 3 },
  { id: 2, title: "Buku Agama", stock: 3 },
  { id: 3, title: "Buku Kamus", stock: 3 }
];

export default function ELibraryUNKLAB() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [fine, setFine] = useState(0);
  const [message, setMessage] = useState("");

  const dailyFine = 7500;

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBook) {
      setMessage("Silakan pilih buku terlebih dahulu.");
      return;
    }

    setMessage(
      `Peminjaman berhasil! Buku: ${selectedBook.title}. Denda: Rp ${fine}. API Key digunakan: ${API_KEY}`
    );
  };

  return (
    <div className="container">
      <h1 className="title">E-Library UNKLAB</h1>
      <p className="subtitle">Sistem Peminjaman Buku</p>

      <div className="card">
        <h2>Pilih Buku</h2>

        <div className="book-list">
          {books.map((book) => (
            <button
              key={book.id}
              className={`book-btn ${
                selectedBook?.id === book.id ? "active" : ""
              }`}
              onClick={() => setSelectedBook(book)}
            >
              {book.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>Tanggal Peminjaman</label>
          <input
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
          />

          <label>Tanggal Pengembalian</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />

          <div className="fine-box">
            <strong>Denda:</strong> Rp {fine}
          </div>

          <button type="submit" className="submit-btn">
            Konfirmasi Peminjaman
          </button>
        </form>

        {message && <div className="result">{message}</div>}
      </div>
    </div>
  );
}

/* Inject CSS otomatis */
const styles = `
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.title {
  text-align: center;
  font-size: 32px;
  color: #004aad;
  font-weight: bold;
}
.subtitle {
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
}

.book-list {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.book-btn {
  flex: 1;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  background: #e0e0e0;
  transition: 0.3s;
}
.book-btn:hover {
  background: #bdbdbd;
}
.active {
  background: #004aad;
  color: white;
}

label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}
input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #aaa;
}

.fine-box {
  background: #eef5ff;
  padding: 12px;
  margin-top: 15px;
  border-radius: 8px;
  font-size: 18px;
}

.submit-btn {
  margin-top: 20px;
  width: 100%;
  background: #004aad;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
}
.submit-btn:hover {
  background: #00337a;
}

.result {
  margin-top: 20px;
  padding: 12px;
  background: #e7f3ff;
  border-left: 5px solid #004aad;
  border-radius: 8px;
  font-weight: bold;
}
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);
