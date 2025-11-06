// src/pages/Tentang.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Tentang.css';
import teamImage from '../assets/team-image.jpg'; 

const Tentang = () => {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    // PENTING: Bungkus semua konten di satu div utama
    <div className="tentang-page-wrapper"> 
      {/* Tombol Masuk di pojok kanan atas page */}
      <button onClick={goToLogin} className="tentang-login-button-header">
        Masuk
      </button>

      <div className="tentang-content"> {/* Konten utama + sidebar */}
        <div className="tentang-main">
          <h2>Tentang Kami</h2>
          <p>
            DiskuShare adalah forum diskusi yang dibuat untuk siapa pun yang ingin
            berbagi ide, bertanya, atau sekadar berdialog dengan santai namun tetap
            berbagi ilmu.
          </p>
          <p>
            DiskuShare adalah ruang terbuka bagi semua untuk berbagi dan
            berdiskusi dengan nyaman. Disini, kamu bisa ngobrolin berbagai topik —
            mulai dari pelajaran, teknologi, hobi, sampai isu terkini. Setiap suara
            berarti, dan setiap pendapat layak didengar dengan sikap
            saling menghargai.
          </p>

          <ul>
            <li>
              <strong>Terbuka</strong> — Semua pendapat layak dipertimbangkan.
            </li>
            <li>
              <strong>Informatif</strong> — Setiap diskusi membawa pengetahuan baru.
            </li>
            <li>
              <strong>Kolaboratif</strong> — Belajar dan tumbuh bersama komunitas.
            </li>
          </ul>

<div className="tentang-image">
  <img src={teamImage} alt="Tim DiskuShare" /> 
  <p className="image-caption">Tempat bertemu ide inspirasi.</p>
</div>

          <h3>Kontak Cepat</h3>
          <p>
            Email: aditya.123140093@student.itera.ac.id
            <br />
            Telp: +6285330769174
          </p>
          <div className="tentang-socials">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <aside className="tentang-sidebar-right">
          <div className="contact-form-card">
            <h3>Hubungi Kami</h3>
            <p>Ada pertanyaan, masukan, atau ide kerja sama? Silakan kirim pesan melalui formulir di bawah ini.</p>
            
            <p>
              <strong>Alamat</strong>
              <br />
              Jl. Terusan Ryacudu, Way Huwi, Kec. Jati Agung, Kab. Lampung Selatan, Lampung
            </p>
            
            <form>
              <label htmlFor="nama">Nama</label>
              <input type="text" id="nama" placeholder="Nama lengkap" />

              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="nama@email.com" />

              <label htmlFor="pesan">Pesan</label>
              <textarea id="pesan" rows="5" placeholder="Tulis pesanmu di sini..."></textarea>

              <button type="submit" className="submit-button">Kirim Pesan</button>
            </form>
            <p className="form-reply-note">Kami akan membalas dalam 1-3 hari kerja.</p>
          </div>
        </aside>
      </div>
    </div> // Tutup tentang-page-wrapper
  );
};

export default Tentang;