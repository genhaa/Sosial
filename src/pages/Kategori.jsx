// src/pages/Kategori.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase
import './Kategori.css'; // Kita bikin CSS baru

// --- Nanti data ini dapet dari Supabase ---
const dummyPosts = [
  {
    id: 1,
    author: 'Laksamana Mawar',
    username: 'mawar_sakti',
    time: '30m yang lalu',
    content: 'Kadang, ide terbaik muncul saat kita tidak berusaha keras. Cukup istirahat, biarkan pikiran liar. Siapa yang setuju?',
    comments: 42,
    likes: 125,
  },
  {
    id: 2,
    author: 'Pandu Digital',
    username: 'pandu_dev',
    time: '2j yang lalu',
    content: 'Revolusi AI bukan tentang mengganti manusia, tapi tentang mengoptimalkan potensi. Kita harus belajar bekerja BERSAMA alat ini. Fokus pada etika!',
    comments: 210,
    likes: 880,
  }
  // Tambahin dummy post dari Figma
];

// --- Ini komponen kecil buat 1 kartu postingan ---
const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-avatar"></div> {/* Nanti diisi foto profil */}
      <div className="post-content">
        <div className="post-header">
          <strong>{post.author}</strong>
          <span className="username">@{post.username}</span>
          <span className="time">· {post.time}</span>
        </div>
        <p>{post.content}</p>
        <div className="post-actions">
          <span>💬 {post.comments}</span>
          <span>❤️ {post.likes}</span>
        </div>
      </div>
    </div>
  );
};

// --- Halaman Kategori Utamanya ---
const Kategori = () => {
  const [posts, setPosts] = useState([]); // Mulai dari array kosong
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  // Pake useEffect buat fetch data pas halaman dibuka
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      // NANTI: Ganti 'posts' & 'profiles' sama nama tabel lo
      // Ini contoh kalo udah di-join tabelnya
      // const { data, error } = await supabase
      //   .from('posts')
      //   .select('*, profiles(username, full_name, avatar_url)')
      //   .order('created_at', { ascending: false });

      // if (error) {
      //   console.error(error);
      // } else {
      //   setPosts(data);
      // }
      
      // --- Pake data dummy dulu ---
      setPosts(dummyPosts); 
      setLoading(false);
    };

    fetchPosts();
  }, []); // [] = jalanin sekali pas load

  const handlePostSubmit = (e) => {
    e.preventDefault();
    alert('Fitur posting belum nyambung ke Supabase, G! Sabar ya.');
    // Nanti di sini logic supabase.from('posts').insert(...)
    setNewPost('');
  };

  return (
    <div className="kategori-layout">
      <main className="kategori-feed">
        <h2>Jelajahi Kategori</h2>
        
        {/* Form Bikin Postingan */}
        <form className="create-post-form" onSubmit={handlePostSubmit}>
          <div className="post-input-wrapper">
            <div className="post-avatar-input"></div>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Apa yang ada di pikiranmu?"
            />
          </div>
          <button type="submit" className="kirim-button">Kirim</button>
        </form>

        {/* Linimasa Postingan */}
        <h3 className="feed-title">Postingan Terkini</h3>
        <div className="feed-list">
          {loading ? (
            <p>Loading postingan...</p>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </main>

      {/* Sidebar Kanan */}
      <aside className="kategori-sidebar-right">
        <input type="text" placeholder="Cari Postingan" className="search-bar" />
        <div className="kategori-card">
          <h4>Jelajahi Kategori</h4>
          <ul className="kategori-list">
            <li><a href="#">Musik</a></li>
            <li><a href="#">Film & Hiburan</a></li>
            <li><a href="#">Olahraga</a></li>
            <li><a href="#">Lingkungan</a></li>
            <li><a href="#">Kesehatan</a></li>
            <li><a href="#">Hobi</a></li>
            <li><a href="#">Makanan</a></li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Kategori;