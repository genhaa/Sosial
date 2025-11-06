// src/pages/Register.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // <-- Import 'jembatan'
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css'; // Pake CSS yang baru dibikin

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Suruh Supabase bikinin akun di sistem 'Auth'
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (authError) throw authError;

      // 2. Kalo berhasil, simpen info profilnya ke tabel 'profiles'
      //    (TEMEN LO HARUS UDAH BIKIN TABEL 'profiles')
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id, // Ambil ID dari user yg baru daftar
          full_name: fullName,
          username: username,
          // Nanti bisa tambah 'bio' dll dari halaman Edit Profile
        });
      if (profileError) throw profileError;

      alert('Registrasi berhasil! Cek email buat verifikasi ya.');
      navigate('/login'); // Lempar user ke halaman login

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Buat Akun Baru</h2>
        
        <label htmlFor="fullName">Nama Lengkap</label>
        <input id="fullName" type="text" placeholder="Nama Kamu"
          value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        
        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Username Kamu"
          value={username} onChange={(e) => setUsername(e.target.value)} required />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="nama@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Kata Sandi</label>
        <input id="password" type="password" placeholder="********"
          value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Sabar...' : 'Masuk'}
        </button>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;