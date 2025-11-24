import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    // Simulasikan proses autentikasi singkat agar terasa lebih nyata
    setTimeout(() => {
      setLoading(false);
      onLogin({
        email: formData.email,
        name: formData.email.split("@")[0],
      });
    }, 600);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">📚</span>
          <div>
            <h1>E-Library UNKLAB</h1>
            <p>Silakan masuk untuk melanjutkan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email UNKLAB</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="nama@unklab.ac.id"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Kata Sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && <p className="alert alert-danger mt-2">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block mt-3" disabled={loading}>
            {loading ? "Memverifikasi..." : "Masuk Sekarang"}
          </button>
        </form>

        <p className="login-helper">
          Tips: gunakan email kampus aktif, sistem ini hanya simulasi sehingga
          menerima kombinasi email dan password apa pun.
        </p>
      </div>
    </div>
  );
}

