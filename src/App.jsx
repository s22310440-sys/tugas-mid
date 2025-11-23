import React, { useState, useEffect } from "react";
import ELibraryUNKLAB from "./components/ELibraryUNKLAB";
import { getBooks, getLoans } from "./api/config";

export default function App() {
  const [activeTab, setActiveTab] = useState("borrow");
  const [loanHistory, setLoanHistory] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, totalLoans: 0 });
  const [loading, setLoading] = useState(false);

  // Load statistics saat aplikasi pertama kali dibuka
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const booksResult = await getBooks();
      const loansResult = await getLoans();

      if (booksResult.success) {
        setStats((prev) => ({
          ...prev,
          totalBooks: booksResult.data.length,
        }));
      }

      if (loansResult.success) {
        setLoanHistory(loansResult.data);
        setStats((prev) => ({
          ...prev,
          totalLoans: loansResult.data.length,
        }));
      }
      setLoading(false);
    };

    loadStats();
  }, []);

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
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.totalBooks}</span>
              <span className="stat-label">Buku</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.totalLoans}</span>
              <span className="stat-label">Peminjaman</span>
            </div>
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
        {activeTab === "borrow" && <ELibraryUNKLAB />}

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
                      <th>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanHistory.map((loan) => (
                      <tr key={loan.id}>
                        <td>#{loan.id}</td>
                        <td>{loan.name?.substring(0, 20) || "Anonim"}</td>
                        <td>{loan.email || "-"}</td>
                        <td>{loan.body?.substring(0, 50) || "-"}...</td>
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
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf5 100%);
        }

        .header {
          background: linear-gradient(135deg, #004aad 0%, #0066cc 100%);
          color: white;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 2.5rem;
        }

        .logo h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: bold;
        }

        .logo p {
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .header-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .navbar {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
          padding: 1rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #666;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .nav-btn:hover {
          background: #f5f7fa;
          color: #004aad;
        }

        .nav-btn.active {
          color: #004aad;
          border-bottom-color: #004aad;
          background: #f0f6ff;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .section-title {
          font-size: 2rem;
          font-weight: bold;
          color: #004aad;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .about-content {
          line-height: 1.8;
        }

        .about-content h3 {
          font-size: 1.5rem;
          color: #004aad;
          margin-bottom: 1rem;
        }

        .about-content h4 {
          font-size: 1.1rem;
          color: #0066cc;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .about-content p {
          margin-bottom: 1rem;
          color: #666;
        }

        .about-content ul {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
          color: #666;
        }

        .about-content li {
          margin-bottom: 0.5rem;
        }

        .footer {
          background: #1a1a1a;
          color: white;
          padding: 2rem;
          margin-top: 2rem;
          text-align: center;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-content p {
          margin: 0.5rem 0;
        }

        .footer-links {
          margin-top: 1rem;
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .footer-links a {
          color: #ffc107;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .header-stats {
            width: 100%;
            justify-content: space-around;
          }

          .nav-container {
            flex-direction: column;
          }

          .nav-btn {
            border-bottom: none;
            border-right: 3px solid transparent;
          }

          .nav-btn.active {
            border-bottom: none;
            border-right-color: #004aad;
          }

          .main-content {
            padding: 1rem;
          }

          .footer-links {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
