// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- 'Alat' buat nangkep URL
import { supabase } from '../supabaseClient';
import './Profile.css'; // Bikin CSS-nya

const Profile = () => {
  // 1. Tangkep 'username' dari URL (cth: /profile/aditsopojarwo)
  const { username } = useParams(); 
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  // 2. useEffect = 'Jalanin ini pas halaman baru kebuka'
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      // 3. Telpon Supabase: "Cari data di tabel 'profiles'
      //    yang kolom 'username'-nya = username dari URL"
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Ambil semua kolom
        .eq('username', username) // 'eq' = equals / sama dengan
        .single(); // Kita tau hasilnya cuma 1

      if (error) {
        console.error('Error fetching profile:', error.message);
      } else {
        setProfile(data);
        // Nanti di sini kita fetch postingan punya si user ini
        // fetchPosts(data.id);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [username]); // <-- 'username' di sini artinya: Kalo URL-nya ganti, fetch ulang

  // Kalo masih loading...
  if (loading) {
    return <div>Loading profil...</div>;
  }

  // Kalo profile gak ketemu...
  if (!profile) {
    return <div>Profil <strong>@{username}</strong> tidak ditemukan.</div>;
  }

  // Kalo ketemu, tampilin! (Sesuai Profile.png)
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-banner"></div> {/* Nanti bisa diisi gambar banner */}
        <div className="profile-info">
          <div className="profile-avatar-large"></div>
          {/* Nanti cek apa ini profil kita sendiri */}
          <button className="edit-profile-btn">Edit Profil</button>
          
          <h2>{profile.full_name}</h2>
          <p className="username">@{profile.username}</p>
          <p className="bio">
            {profile.bio || 'User ini belum nulis bio.'}
          </p>
          <div className="profile-stats">
            <span><strong>245</strong> Mengikuti</span>
            <span><strong>890</strong> Pengikut</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button className="active">Postingan</button>
          <button>Disukai</button>
        </div>
        <div className="profile-timeline">
          <p>Linimasa profil (postingan punya si <strong>{profile.full_name}</strong>)</p>
          {/* Nanti di-looping postingannya di sini */}
        </div>
      </div>
    </div>
  );
};

export default Profile;