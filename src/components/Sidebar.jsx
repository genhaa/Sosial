// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // PAKE <Link>, BUKAN <a href>
import './Sidebar.css'; // Kita bikin CSS-nya

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">
          DS <span>DiskuShare</span>
        </Link>
        <p>Dari kita, oleh kita, untuk kita</p>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/profile/me">Profil</Link></li> {/* Nanti "me" ini dinamis */}
        <li><Link to="/">Beranda</Link></li> {/* Di Figma Beranda = Kategori */}
        <li><Link to="/popular">Populer</Link></li>
        <li><Link to="/kategori">Kategori</Link></li>
        <li><Link to="/tentang">Tentang</Link></li>
      </ul>
      {/* Nanti bisa tambah tombol Logout di sini */}
    </nav>
  );
};
export default Sidebar;