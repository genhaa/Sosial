// src/services/follows.js
import { supabase } from "./supabase.js";

// FollowUser dan unfollowUser biarkan apa adanya
export async function followUser(userIdToFollow) {
  // Ambil data pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  
  // Jika belum login, hentikan dengan error
  if (!user) {
    throw new Error("Anda harus login untuk follow!");
  }

  // Cegah agar pengguna tidak bisa follow dirinya sendiri
  if (user.id === userIdToFollow) {
    throw new Error("Tidak bisa follow diri sendiri.");
  }
  // Simpan data follow ke tabel "follows"
  const { data, error } = await supabase
    .from("follows")
    .insert([{ 
      follower_id: user.id,         // ID orang yang follow
      following_id: userIdToFollow  // ID orang yang di-follow
    }]);
  // Jika error saat insert, tampilkan dan hentikan
  if (error) {
    console.error("Gagal follow:", error.message);
    throw error;
  }
  // Setelah follow berhasil, buat notifikasi untuk orang yang di-follow
  await supabase.from("notifications").insert([
    {
      recipient_id: userIdToFollow, // penerima notifikasi
      actor_id: user.id, // yang melakukan follow
      notification_type: 'new_follow' // tipe notifikasi
    }
  ]);
  // Kembalikan hasil insert
  return data;
}
export async function unfollowUser(userIdToUnfollow) {
  // Ambil data pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  // Jika belum login, hentikan dengan error
  if (!user) {
    throw new Error("Harus login untuk unfollow.");
  }
  // Hapus data follow berdasarkan relasi follower-following
  const { data, error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id) // siapa yang unfollow
    .eq("following_id", userIdToUnfollow); // siapa yang di-unfollow
  // Jika error, tampilkan
  if (error) {
    console.error("Gagal unfollow:", error.message);
    throw error;
  }
  // Kembalikan data hasil delete
  return data;
}

// Cek apakah user sudah follow orang lain
export async function checkIfFollowing(userIdToFollow) {
  // Ambil user yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  // Cek di tabel "follows" apakah user sudah mengikuti user lain
  const { data, error } = await supabase
    .from("follows")
    .select("created_at") // tidak perlu ambil semua kolom, cukup satu
    .eq("follower_id", user.id)
    .eq("following_id", userIdToFollow)
    .limit(1); // cukup ambil satu data jika ada
  // Jika error, tampilkan dan kembalikan false
  if (error) {
    console.error("Gagal cek status follow:", error);
    return false;
  }
  // Kembalikan true jika data ada, false jika tidak
  return data && data.length > 0;
}


export async function getFollowersList(userId, page = 1, limit = 20) {
  // Hitung batas data untuk pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  // Ambil data followers dari tabel "follows"
  const { data, error } = await supabase
    .from("follows")
    .select("profile:users!follower_id(id, name, handle, avatar_url)")
    .eq("following_id", userId) // Ambil semua yang mengikuti user ini
    // Filter blokir dihapus agar kode lebih sederhana
    .range(from, to); // Pagination
  // Jika error, tampilkan dan kembalikan array kosong
  if (error) {
    console.error("Gagal mengambil daftar followers:", error);
    return [];
  }
  return data.map(item => item.profile);
}

export async function getFollowingList(userId, page = 1, limit = 20) {
  // Hitung batas data untuk pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  // Ambil data following dari tabel "follows"
  const { data, error } = await supabase
    .from("follows")
    // Join ke tabel users lewat kolom following_id
    .select("profile:users!following_id(id, name, handle, avatar_url)")
    .eq("follower_id", userId)
    // Filter blokir juga dihapus seperti permintaan
    .range(from, to);
  // Jika ada error, tampilkan dan kembalikan array kosong
  if (error) {
    console.error("Gagal mengambil daftar following:", error);
    return [];
  }
  return data.map(item => item.profile);
}
