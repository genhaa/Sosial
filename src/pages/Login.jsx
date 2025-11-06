// src/pages/Login.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // <-- Import 'jembatan'
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css'; // Pake CSS yang sama

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      
      // Kalo berhasil, lempar ke halaman utama
      navigate('/'); 

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Masuk ke Akunmu</h2>
        
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="nama@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="password">Kata Sandi</label>
        <input id="password" type="password" placeholder="********"
          value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Loading...' : 'Masuk'}
        </button>

        <p className="auth-switch">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </form>
    </div>
  );
};
export default Login;