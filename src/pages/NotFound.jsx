// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Halaman yang kamu cari tidak ditemukan.</p>
      <p>
        Coba periksa kembali alamat URL atau pastikan koneksi internetmu stabil.
      </p>
      <Link to="/" className="back-home-button">
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
};

export default NotFound;