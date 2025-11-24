import React, { useState, useEffect } from "react";
import ELibraryUNKLAB from "./components/ELibraryUNKLAB";
import BookReturn from "./components/BookReturn";
import Login from "./components/Login";
import { getBooks } from "./api/config";

const LOAN_STORAGE_KEY = "riwayat_pinjaman";

export default function App() {
  const [activeTab, setActiveTab] = useState("borrow");
  const [loanHistory, setLoanHistory] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, totalLoans: 0 });
  const [loading, setLoading] = useState(false);
  const [returnTicket, setReturnTicket] = useState(null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("elib-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loadUserLoans = (email) => {
    const stored = JSON.parse(localStorage.getItem(LOAN_STORAGE_KEY) || "[]");
    const userLoans = stored.filter((loan) => loan.userEmail === email);
    setLoanHistory(userLoans);
    setStats((prev) => ({
      ...prev,
      totalLoans: userLoans.length,
    }));
  };

  const saveLoanRecord = (record) => {
    const stored = JSON.parse(localStorage.getItem(LOAN_STORAGE_KEY) || "[]");
    const enhancedRecord = {
      id: Date.now(),
      ...record,
    };
    localStorage.setItem(
      LOAN_STORAGE_KEY,
      JSON.stringify([...stored, enhancedRecord])
    );
    loadUserLoans(record.userEmail);
    return enhancedRecord;
  };

  // Load statistics saat aplikasi pertama kali dibuka
  useEffect(() => {
    if (!user) {
      setLoanHistory([]);
      setStats({ totalBooks: 0, totalLoans: 0 });
      return;
    }

    const loadStats = async () => {
      setLoading(true);
      const booksResult = await getBooks();

      if (booksResult.success) {
        setStats((prev) => ({
          ...prev,
          totalBooks: booksResult.data.length,
        }));
      }

      setLoading(false);
    };

    loadStats();
    loadUserLoans(user.email);
  }, [user]);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    localStorage.setItem("elib-user", JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("elib-user");
    setActiveTab("borrow");
    setReturnTicket(null);
  };

  const handleBorrowComplete = (ticket) => {
    if (!user) return;

    const borrowerName = ticket.borrowerName || user.name || "Pengguna";
    const recordPayload = {
      borrowerName,
      userEmail: user.email,
      bookTitle: ticket.bookTitle,
      borrowDate: ticket.borrowDate,
      plannedReturnDate: ticket.plannedReturnDate,
      notes: ticket.notes || "-",
    };

    const savedRecord = saveLoanRecord(recordPayload);

    setReturnTicket({
      ...ticket,
      borrowerName: savedRecord.borrowerName,
      userEmail: savedRecord.userEmail,
    });
    setActiveTab("return");
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <div>
              <h1>E-Library UNKLAB</h1>
              <p>Sistem Manajemen Perpustakaan Digital</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.totalBooks}</span>
                <span className="stat-label">Buku</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.totalLoans}</span>
                <span className="stat-label">Peminjaman</span>
              </div>
              <div className="stat-item user-pill">
                <span className="stat-number">{user.name || "Pengguna"}</span>
                <span className="stat-label">{user.email}</span>
              </div>
            </div>
            <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <button
            className={`nav-btn ${activeTab === "borrow" ? "active" : ""}`}
            onClick={() => setActiveTab("borrow")}
          >
            <span>📖</span> Peminjaman Buku
          </button>
          <button
            className={`nav-btn ${activeTab === "return" ? "active" : ""}`}
            onClick={() => setActiveTab("return")}
          >
            <span>🔄</span> Pengembalian Buku
          </button>
          <button
            className={`nav-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <span>📋</span> Riwayat Peminjaman
          </button>
          <button
            className={`nav-btn ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <span>ℹ️</span> Tentang Aplikasi
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Tab: Peminjaman Buku */}

        {activeTab === "borrow" && (
          <ELibraryUNKLAB
            onNavigateReturn={() => setActiveTab("return")}
            onBorrowComplete={handleBorrowComplete}
            currentUser={user}
          />
        )}

        {/* Tab: Pengembalian Buku */}
        {activeTab === "return" && (
          <BookReturn
            ticket={returnTicket}
            onBackToBorrow={() => setActiveTab("borrow")}
          />
        )}

        {/* Tab: Riwayat Peminjaman */}
        {activeTab === "history" && (
          <div className="container">
            <h2 className="section-title">📋 Riwayat Peminjaman</h2>
            {loading ? (
              <div className="card">
                <p className="info-box">Memuat data...</p>
              </div>
            ) : loanHistory.length > 0 ? (
              <div className="card">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Peminjam</th>
                      <th>Email</th>
                      <th>Judul Buku</th>
                      <th>Tanggal Pinjam</th>
                      <th>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.map((loan) => (
                      <tr key={loan.id}>
                        <td>#{loan.id}</td>
                        <td>{loan.borrowerName || user.name || "Anonim"}</td>
                        <td>{loan.userEmail}</td>
                        <td>{loan.bookTitle}</td>
                        <td>{loan.borrowDate}</td>
                        <td>{loan.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="card">
                <p className="alert alert-info">
                  Belum ada riwayat peminjaman. Mulai peminjaman buku sekarang!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Tentang Aplikasi */}
        {activeTab === "about" && (
          <div className="container">
            <h2 className="section-title">ℹ️ Tentang Aplikasi</h2>
            <div className="card">
              <div className="about-content">
                <h3>E-Library UNKLAB v1.0</h3>
                <p>
                  Sistem manajemen perpustakaan digital untuk Universitas
                  Klabat (UNKLAB) yang memudahkan mahasiswa dan dosen dalam
                  meminjam buku.
                </p>

                <h4>✨ Fitur Utama:</h4>
                <ul>
                  <li>✓ Peminjaman buku online</li>
                  <li>✓ Perhitungan otomatis denda keterlambatan</li>
                  <li>✓ Riwayat peminjaman</li>
                  <li>✓ Interface yang user-friendly</li>
                  <li>✓ Integrasi dengan API</li>
                </ul>

                <h4>🛠️ Teknologi yang Digunakan:</h4>
                <ul>
                  <li>React 18.3.1</li>
                  <li>Vite (Build Tool)</li>
                  <li>CSS Modern (Flexbox, Grid)</li>
                  <li>JSONPlaceholder API (Demo)</li>
                </ul>

                <h4>📞 Informasi Kontak:</h4>
                <p>
                  Email: library@unklab.ac.id
                  <br />
                  Phone: (0431) 812345
                  <br />
                  Lokasi: Universitas Klabat, Manado
                </p>

                <h4>📋 Kebijakan Peminjaman:</h4>
                <ul>
                  <li>Durasi peminjaman standar: 7 hari</li>
                  <li>Denda keterlambatan: Rp 7.500 per hari</li>
                  <li>Maksimal buku yang dipinjam: 5 buku</li>
                  <li>Dapat diperpanjang 2 kali jika tidak ada pemesanan</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 E-Library UNKLAB. All rights reserved.</p>
          <p>

          </p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Inline Styles untuk Layout Komponen */}
      <style>{`
        .app {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f5f6fa;
        }

        .header {
          background: #ffffff;
          color: #1f2a37;
          padding: 1.75rem 0;
          border-bottom: 1px solid #e2e6ef;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 2.2rem;
        }

        .logo h1 {
          margin: 0;
          font-size: 1.65rem;
          font-weight: 600;
        }

        .logo p {
          margin: 0.2rem 0 0 0;
          color: #5b6472;
          font-size: 0.95rem;
        }

        .header-stats {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .stat-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stat-number {
          font-size: 1.35rem;
          font-weight: 600;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #808694;
        }

        .user-pill {
          background: #f2f4f8;
          padding: 0.75rem 1.25rem;
          border-radius: 14px;
          min-width: 200px;
        }

        .logout-btn {
          border: none;
          background: #1f2a37;
          color: #fff;
          padding: 0.65rem 1.6rem;
          border-radius: 999px;
        }

        .logout-btn:hover {
          background: #253246;
        }

        .navbar {
          background: #ffffff;
          border-bottom: 1px solid #e2e6ef;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 0;
        }

        .nav-btn {
          flex: 1;
          padding: 0.95rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #5b6472;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.45rem;
        }

        .nav-btn:hover {
          background: #f3f5f9;
          color: #1f2a37;
        }

        .nav-btn.active {
          color: #1f2a37;
          border-bottom-color: #1f2a37;
          background: #eef2f7;
        }

        .main-content {
          flex: 1;
          padding: 2.5rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #1f2a37;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .about-content {
          line-height: 1.75;
          color: #4f5563;
        }

        .about-content h3 {
          font-size: 1.4rem;
          color: #1f2a37;
          margin-bottom: 0.85rem;
        }

        .about-content h4 {
          font-size: 1rem;
          color: #4a6c8d;
          margin-top: 1.4rem;
          margin-bottom: 0.4rem;
        }

        .about-content p {
          margin-bottom: 1rem;
        }

        .about-content ul {
          margin-left: 1.25rem;
          margin-bottom: 1rem;
        }

        .about-content li {
          margin-bottom: 0.4rem;
        }

        .footer {
          background: #f8f9fb;
          color: #5b6472;
          padding: 2rem 0;
          margin-top: 2rem;
          text-align: center;
          border-top: 1px solid #e2e6ef;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-content p {
          margin: 0.4rem 0;
        }

        .footer-links {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .footer-links a {
          color: #1f2a37;
          text-decoration: none;
          font-weight: 500;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1.25rem;
            padding: 0 1.25rem;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .header-stats {
            width: 100%;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .logout-btn {
            width: 100%;
          }

          .nav-container {
            flex-direction: column;
          }

          .nav-btn {
            border-bottom: 1px solid #e2e6ef;
          }

          .nav-btn.active {
            border-bottom-color: #1f2a37;
          }

          .main-content {
            padding: 1.5rem 1.25rem;
          }

          .footer-links {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
