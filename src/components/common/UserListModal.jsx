// src/components/common/UserListModal.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getFollowersList, getFollowingList } from '../../services/follows.js';
import Loading from './Loading.jsx';

// --- Styled Components ---

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  height: 500px; /* Kita beri tinggi tetap */
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 { margin: 0; }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
`;

const UserList = styled.div`
  flex: 1; /* Biarkan list mengisi sisa ruang */
  overflow-y: auto; /* Aktifkan scroll jika list-nya panjang */
  padding: 0.5rem 0;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  
  &:hover {
    background: #f9f9f9;
  }
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  span:first-child { font-weight: 700; }
  span:last-child { font-size: 0.9rem; color: #777; }
`;

// --- Komponen Utama ---

/**
 * Modal ini menerima:
 * - title: "Mengikuti" or "Pengikut"
 * - userIdToFetch: ID dari user yang profilnya sedang kita lihat
 * - fetchType: "following" or "followers"
 * - onClose: Fungsi untuk menutup modal
 */
const UserListModal = ({ title, userIdToFetch, fetchType, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data;
      if (fetchType === 'following') {
        data = await getFollowingList(userIdToFetch); //
      } else {
        data = await getFollowersList(userIdToFetch); //
      }
      setUsers(data || []);
      setLoading(false);
    };
    
    fetchData();
  }, [userIdToFetch, fetchType]);

  const handleUserClick = (handle) => {
    onClose(); // Tutup modal
    navigate(`/profil/${handle}`); // Pindah ke profil user
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>{title}</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <UserList>
          {loading ? (
            <Loading />
          ) : (
            users.map(user => (
              <UserItem key={user.id} onClick={() => handleUserClick(user.handle)}>
                <Avatar src={user.avatar_url || 'default-avatar-url.png'} />
                <UserInfo>
                  <span>{user.name}</span>
                  <span>@{user.handle}</span>
                </UserInfo>
              </UserItem>
            ))
          )}
        </UserList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserListModal;