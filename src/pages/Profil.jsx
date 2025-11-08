// src/pages/Profil.jsx
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; 
// import fungsi baru untuk fitur follow/unfollow dan daftar pengguna
import { followUser, unfollowUser, getFollowingList, getFollowersList, checkIfFollowing } from '../services/follows.js';
// impor service lain untuk data profil dan postingan
import { getUserProfile, getUserByHandle } from '../services/auth.js';
import { getPostsByUserId } from '../services/posts.js';
import { getLikedPosts } from '../services/posts.js';
import PostCard from '../components/post/PostCard.jsx';
import Loading from '../components/common/Loading.jsx';
import UserListModal from '../components/common/UserListModal.jsx';

// Styled Components untuk tampilan halaman profil
const Banner = styled.div`
  height: 250px;
  background-color: #eee;
  background: linear-gradient(to right, #B92B27, #1565C0);
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: center -320px;
`;
const ProfileHeader = styled.div`
  padding: 0 2rem;
  position: relative;
  padding-top: 1rem;
`;
const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: -45px;
  right: 2rem;
`;
const ProfileButton = styled.button`
  background-color: ${props => (props.primary ? props.theme.colors.primary : '#FFF')};
  color: ${props => (props.primary ? '#FFF' : '#000')};
  border: ${props => (props.primary ? 'none' : '1px solid #ccc')};
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
  &:hover { opacity: 0.9; }
`;
const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.background};
  background: #fff;
  margin-top: -75px;
`;
const ProfileInfo = styled.div`
  margin-top: 0.5rem;
  h2 {
    font-size: 1.8rem;
    margin: 0;
  }
  span {
    color: #555;
    font-size: 1rem;
  }
  p {
    margin-top: 1rem;
    line-height: 1.6;
  }
`;
const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;
const StatItem = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-top: 2rem;
`;
const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #777;
  
  ${props => props.active && css`
    color: ${props.theme.colors.primary};
    border-bottom: 3px solid ${props.theme.colors.primary};
  `}
`;
// Styled Components Selesai


// Komponen Utama
const Profil = () => {
  const { username } = useParams(); 
  const { user: currentUser, profile: contextProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('postingan');
  const [loading, setLoading] = useState(true);
  
  const [isFollowing, setIsFollowing] = useState(false); 
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    userIdToFetch: null,
    fetchType: null,
  });

  const isMyProfile = contextProfile?.handle === username;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      let profileData; 

      if (isMyProfile) {
        profileData = contextProfile; 
      } else {
        profileData = await getUserByHandle(username);
      }
      
      if (!profileData) {
        navigate('/404');
        return;
      }
      
      setProfile(profileData);
      
      // Cek status follow HANYA jika ini BUKAN profil kita
      if (profileData && !isMyProfile) {
        const followingStatus = await checkIfFollowing(profileData.id);
        setIsFollowing(followingStatus);
      }
      // Selesai

      const postData = await getPostsByUserId(profileData.id);
      setPosts(postData);
      setLoading(false);
    };

    fetchProfileData();
  }, [username, navigate, isMyProfile, contextProfile]);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    if (!profile) return; 
    if (tab === 'postingan') {
      const postData = await getPostsByUserId(profile.id);
      setPosts(postData);
    } else if (tab === 'disukai') {
      const likedData = await getLikedPosts(profile.id);
      setPosts(likedData);
    }
    setLoading(false);
  };
  
  // Ini adalah handleFollow yang baru (dengan try...catch)
  const handleFollow = async () => {
    if (!profile) return;
    
    try {
      if (isFollowing) {
        // Unfollow
        await unfollowUser(profile.id);
        setIsFollowing(false);
      } else {
        // Follow
        await followUser(profile.id);
        setIsFollowing(true);
      }
    } catch (err) {
      // Jika RLS gagal, alert ini akan muncul
      alert("Gagal melakukan aksi: " + err.message);
    }
  };
  // Selesai handleFollow
  
  const handleEditProfile = () => {
    navigate('/pengaturan/akun');
  };

  if (!profile) {
    return <Loading />;
  }

  // Fungsi Modal
  const openModal = (type) => {
    if (type === 'following') {
      setModalState({
        isOpen: true,
        title: 'Mengikuti',
        userIdToFetch: profile.id,
        fetchType: 'following',
      });
    } else if (type === 'followers') {
      setModalState({
        isOpen: true,
        title: 'Pengikut',
        userIdToFetch: profile.id,
        fetchType: 'followers',
      });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', userIdToFetch: null, fetchType: null });
  };

  // JSX/tampilan utama
  return (
    <div>
      <Banner bgImage={profile.banner_url} /> 
      
      <ProfileHeader>
        <HeaderActions>
          {isMyProfile ? (
            <ProfileButton onClick={handleEditProfile}>Edit Profil</ProfileButton>
          ) : (
            <ProfileButton primary={!isFollowing} onClick={handleFollow}>
              {isFollowing ? 'Mengikuti' : 'Ikuti'}
            </ProfileButton>
          )}
        </HeaderActions>
        
        <Avatar src={profile.avatar_url || 'default-avatar-url.png'} />
        
        <ProfileInfo>
          <h2>{profile.name}</h2>
          <span>@{profile.handle}</span>
          <p>{profile.bio || 'Belum ada bio.'}</p>
        </ProfileInfo>
        
        <Stats>
          <StatItem onClick={() => openModal('following')}>
            <strong>{profile.following_count}</strong> Mengikuti
          </StatItem>
          <StatItem onClick={() => openModal('followers')}>
            <strong>{profile.follower_count}</strong> Pengikut
          </StatItem>
        </Stats>
      </ProfileHeader>
      
      <TabContainer>
        <TabButton 
          active={activeTab === 'postingan'} 
          onClick={() => handleTabChange('postingan')}
        >
          Postingan
        </TabButton>
        <TabButton 
          active={activeTab === 'disukai'} 
          onClick={() => handleTabChange('disukai')}
        >
          Disukai
        </TabButton> 
      </TabContainer>      
      
      <div>
        {loading ? (
          <Loading />
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {modalState.isOpen && (
        <UserListModal
          title={modalState.title}
          userIdToFetch={modalState.userIdToFetch}
          fetchType={modalState.fetchType}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Profil;
