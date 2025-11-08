// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'; //import hook bawaan react
import { supabase } from '../services/supabase.js'; // import koneksi supabase
import { getUserProfile } from '../services/auth.js'; // import fungsi ambil profil user

const AuthContext = createContext(); // buat context global untuk autentikasi

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // menyimpan data user login dari supabase
  const [session, setSession] = useState(null);     // menyimpan sesi data login
  const [profile, setProfile] = useState(null);     // menyimpan profil tambahan dari tabel"profiles"
  const [loading, setLoading] = useState(true);     // menandakan apakah data masih di-load

  // fungsi untuk ambil data profil user dari database
  const fetchProfile = async (currentUser) => {
    if (currentUser) {      // jika user sedang login
      setLoading(true);
      try {
        const profileData = await getUserProfile(currentUser.id);    // ambil data profil berdasarkan ID user
        setProfile(profileData);                                     // simpan ke state profile
      } catch (err) {
        console.error("Gagal fetch profile di context:", err);       // tampilkan error jika gagal ambil data
        setProfile(null);
      } finally {
        setLoading(false);                                           // selesai loading
      }
    } else {
      setProfile(null);                                              // jika tidak ada user, kosongkan profile
      setLoading(false);
    }
  };

  // jalankan efek ketika komponen pertama kali di-load
  useEffect(() => {
    // ambil sesi login yang sedang aktif
    supabase.auth.getSession().then(({ data: { session } }) => {    
      setSession(session);                             // simpan sesi ke state
      const currentUser = session?.user ?? null;       // cek apakah user ada
      setUser(currentUser);                            // simpan data user
      fetchProfile(currentUser);                       // ambil data profil user  
    });

    // dengarkan perubahan status autentikasi (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);                         //update sesi jika berubah
        const currentUser = session?.user ?? null;
        setUser(currentUser);                        // update user
        fetchProfile(currentUser);                   // ambil ulang profil saat user berubah 
      }
    );

    // hapus listener saat komponen di-unmount agar tidak terjadi duplikasi event
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // fungsi untuk memperbaharui profil user dari database (refresh)
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);    // ambil ulang data profil dari supabase
    }
  };

  // fungsi untuk memperbaharui data profil secara lokal di state (tanpa fetch ulang)
  const updateLocalProfile = (newData) => {
    setProfile(prevProfile => ({
      ...prevProfile, // Ambil semua data profil lama
      ...newData      // Timpa dengan data baru (cth: { name, bio, avatar_url })
    }));
  };

  // kumpulkan data dan fungsi yang bisa diakses oleh komponen lain
  const value = {
    session,                    // menyimpan sesi login user
    user,                       // menyimpan data user supabase
    profile,                    // menyimpan profil tambahan user
    refreshProfile,             // fungsi untuk refresh profil dari server
    updateLocalProfile,         // fungsi untuk update profil secara lokal
  };


  return (
    <AuthContext.Provider value={value}>    
      {!loading && children}                 
    </AuthContext.Provider>
  );
};

// customer hook untuk menggunakan AuthContext di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);  //mempermudah akses data user, session dan profile
};
