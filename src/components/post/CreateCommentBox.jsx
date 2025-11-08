// src/components/post/CreateCommentBox.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { createComment } from '../../services/comments'; // <-- Panggil service komen

// styling yang mirip dengan CreatePostBox
const CreateCommentWrapper = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid #eee;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem;
  margin-top: 1rem; // Pisahkan dari post utama
  display: flex;
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #eee;
  margin-right: 1rem;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// Buat inputnya sedikit beda
const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid #ddd; 
  border-radius: 4px;
  font-size: 1rem; 
  font-family: inherit;
  resize: none;
  min-height: 60px;
  padding: 0.75rem;

  &::placeholder { color: #aaa; }
  &:focus { 
    outline: 2px solid ${({ theme }) => theme.colors.primary}; 
    border-color: transparent;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-end;
  margin-top: 1rem;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

/**
 * Helper function untuk mencari tagar dari teks.
 * Cth: "Halo #pagi #dunia" akan menjadi ["pagi", "dunia"]
 */
const extractHashtags = (text) => {
  const regex = /#(\w+)/g; // Cari #diikuti_kata
  let matches;
  const tags = new Set(); // Pakai 'Set' agar tag unik (tidak dobel)
  
  while ((matches = regex.exec(text)) !== null) {
    // Ambil grup ke-1 (kata tanpa #)
    tags.add(matches[1]); 
  }
  return Array.from(tags); // Kembalikan sebagai array
};

/**
 * Komponen ini butuh 'postId' untuk tahu komen ini milik post mana,
 * dan 'onCommentCreated' untuk memberi tahu parent (PostDetail)
 * agar me-refresh daftar komentarnya.
 */
const CreateCommentBox = ({ postId, onCommentCreated }) => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (content.trim() === '') return;
    
    const categoryNames = extractHashtags(content);
    
    const newCommentData = await createComment(postId, content, categoryNames); 

    if (newCommentData) { 
      const originalContent = content;
      setContent('');
      
      if (onCommentCreated) {
        onCommentCreated(newCommentData, originalContent); 
      }
    } else {
      alert("Gagal mengirim komentar. Silakan coba lagi.");
    }
  };
    
  return (
    <CreateCommentWrapper>
      <Avatar src={profile?.avatar_url || 'default-avatar-url.png'} />
      <InputArea>
        <Textarea
          placeholder="Tulis balasanmu..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button 
          onClick={handleSubmit}
          disabled={content.trim() === ''}
        >
          Kirim Balasan
        </Button>
      </InputArea>
    </CreateCommentWrapper>
  );
};

export default CreateCommentBox;
