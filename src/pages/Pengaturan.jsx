// src/pages/Pengaturan.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar, uploadBanner } from '../services/auth.js';
import { useNavigate } from 'react-router-dom';

// --- (Styling biarkan apa adanya) ---
const PageWrapper = styled.div`
  max-width: 700px;
`;
const PageHeader = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;
const Form = styled.form`
  background: #fff;
  border: 1px solid #eee;
  padding: 2rem;
  border-radius: 8px;
`;
const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
`;
const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem 1rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
`;
const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 2rem;
  &:hover { opacity: 0.9; }
`;
// --- (Styling selesai) ---


// --- Komponen Utama ---
const Pengaturan = () => {
  const { profile, updateLocalProfile } = useAuth(); 
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newData = {
        name: name,
        bio: bio
      };

      // 1. Update text (bio, name)
      // (Fungsi ini akan 'throw' error jika gagal)
      await updateProfile({ name, bio });
      
      // 2. Upload avatar JIKA ada file baru
      if (avatarFile) {
        // (Fungsi ini akan 'throw' error jika gagal)
        const newAvatarUrl = await uploadAvatar(avatarFile);
        if (newAvatarUrl) {
          newData.avatar_url = newAvatarUrl;
        }
      }
      
      // 3. Upload banner JIKA ada file baru
      if (bannerFile) {
        // (Fungsi ini akan 'throw' error jika gagal)
        const newBannerUrl = await uploadBanner(bannerFile);
        if (newBannerUrl) {
          newData.banner_url = newBannerUrl;
        }
      }
      
      // 4. Update context secara lokal
      updateLocalProfile(newData);
      
      // 5. Beri notifikasi SUKSES
      alert('Profil berhasil diperbarui!');
      
      navigate(`/profil/${profile.handle}`); // Kembali ke profil
      
    } catch (err) {
      // --- ⬇️ INI PERUBAHAN UTAMANYA ⬇️ ---
      // 6. Tangkap error dan TAMPILKAN PESAN ERROR ASLINYA
      console.error("Gagal total di Pengaturan.jsx:", err);
      alert('Gagal memperbarui profil. Pesan: ' + err.message);
      // --- ⬆️ SELESAI PERUBAHAN ⬆️ ---
    }
  };
  
  // (Render JSX biarkan apa adanya)
  return (
    <PageWrapper>
      <PageHeader>Edit Profil</PageHeader>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="avatar">Foto Profil (Avatar)</Label>
        <Input 
          type="file" 
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
        />
        
        <Label htmlFor="banner">Foto Sampul (Banner)</Label>
        <Input 
          type="file" 
          id="banner"
          accept="image/*"
          onChange={(e) => setBannerFile(e.target.files[0])}
        />
        
        <Label htmlFor="name">Nama</Label>
        <Input 
          type="text" 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        
        <Button type="submit">Simpan Perubahan</Button>
      </Form>
    </PageWrapper>
  );
};

export default Pengaturan;