import React, { useState } from "react";

const DAILY_FINE = 7500;

export default function BookReturn({ ticket, onBackToBorrow = () => {} }) {
  const [actualReturnDate, setActualReturnDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!ticket) {
    return (
      <div className="container">
        <h1 className="title">🔄 Pengembalian Buku</h1>
        <p className="subtitle">
          Belum ada data peminjaman aktif. Mulai dari halaman peminjaman untuk
          menghitung denda pengembalian.
        </p>
        <div className="card">
          <div className="info-box">
            Tekan tombol di bawah untuk kembali ke halaman peminjaman buku.
          </div>
          <button className="btn btn-primary btn-block" onClick={onBackToBorrow}>
            Ke Halaman Peminjaman
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!actualReturnDate) {
      setError("Tanggal pengembalian aktual wajib diisi.");
      return;
    }

    const scheduled = new Date(ticket.plannedReturnDate);
    const actual = new Date(actualReturnDate);

    if (actual < scheduled) {
      setResult({
        fine: 0,
        lateDays: 0,
        actualReturnDate,
      });
      return;
    }

    const diffTime = actual - scheduled;
    const lateDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const fine = lateDays * DAILY_FINE;

    setResult({
      fine,
      lateDays,
      actualReturnDate,
    });
  };

  return (
    <div className="container">
      <h1 className="title">🔄 Pengembalian Buku</h1>
      <p className="subtitle">
        Verifikasi pengembalian dan lihat estimasi denda secara otomatis.
      </p>

      <div className="card">
        <h2>Detail Peminjaman</h2>
        <div className="info-box">
          <p>Nama Peminjam: <strong>{ticket.borrowerName}</strong></p>
          <p>Email: <strong>{ticket.userEmail}</strong></p>
          <p>Buku: <strong>{ticket.bookTitle}</strong></p>
          <p>Tanggal Pinjam: <strong>{ticket.borrowDate}</strong></p>
          <p>Tanggal Pengembalian Terjadwal: <strong>{ticket.plannedReturnDate}</strong></p>
          {ticket.notes && (
            <p>Catatan: <strong>{ticket.notes}</strong></p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tanggal Pengembalian Aktual</label>
            <input
              type="date"
              value={actualReturnDate}
              onChange={(e) => setActualReturnDate(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="submit-btn">
            Proses Pengembalian
          </button>
        </form>

        {result && (
          <div className="result mt-2">
            <p>
              Nama Peminjam: <strong>{ticket.borrowerName}</strong>
            </p>
            <p>
              Tanggal Pengembalian Terjadwal:{" "}
              <strong>{ticket.plannedReturnDate}</strong>
            </p>
            <p>
              Tanggal Pengembalian Aktual:{" "}
              <strong>{result.actualReturnDate}</strong>
            </p>
            <p>
              Keterlambatan: <strong>{result.lateDays} hari</strong>
            </p>
            <p>
              Estimasi Denda:{" "}
              <strong>Rp {result.fine.toLocaleString("id-ID")}</strong>
            </p>
            {result.lateDays === 0 && (
              <p className="mt-1">👍 Terima kasih, tidak ada denda karena pengembalian tepat waktu.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

