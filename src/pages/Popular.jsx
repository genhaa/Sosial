// src/pages/Popular.jsx
import React from 'react';
import './Home.css'; // Kita pake CSS dari Home aja biar mirip

const Popular = () => {
  return (
    <div className="home-layout">
      <main className="home-feed">
        <h2>Populer</h2>
        <p>Halaman topik terhangat. (Sesuai Figma Populer.png)</p>
        <p>Struktur halamannya mirip Home, tapi isinya beda.</p>
        <p>Logikanya nanti: <strong>supabase.from('posts').select('*').order('likes', ( ascending: false ))</strong></p>
      </main>

      <aside className="home-sidebar-right">
        <input type="text" placeholder="Cari Postingan" className="search-bar" />
        <div className="kategori-card">
          <h4>Jelajahi Kategori</h4>
          {/* ... (isi kategori sama kayak Home) ... */}
        </div>
      </aside>
    </div>
  );
};

export default Popular;