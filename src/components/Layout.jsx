// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Ini 'jendela'-nya
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar /> {/* Kiri: Sidebar Merah */}
      <main className="content">
        <Outlet /> {/* Kanan: Halamannya (Home, Profile, dll) */}
      </main>
    </div>
  );
};
export default Layout;