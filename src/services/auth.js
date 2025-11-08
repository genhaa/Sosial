// src/services/auth.js
import { supabase } from "./supabase.js";

// Fungsi registerUser dan loginUser biarkan apa adanya
export async function registerUser(fullName, email, password, handle) {
  // Mendaftarkan user baru ke Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: { data: { name: fullName } },
  });
  if (error) {
    alert("❌ Gagal daftar: " + error.message);
    return;
  }

  alert("✅ Pendaftaran berhasil! Cek email kamu untuk verifikasi.");

  // Simpan data user tambahan ke tabel `users`
  if (data.user) {
    await supabase.from("users").insert([
      { id: data.user.id, name: fullName, email: email, handle: handle },
    ]);
  }
}

export async function loginUser(email, password) {
  // Melakukan login menggunakan email & password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    alert("❌ Gagal login: " + error.message);
    return;
  }
  alert("✅ Login berhasil, selamat datang " + data.user.email);
}

// --- (Fungsi getUserProfile dan getUserByHandle biarkan apa adanya) ---
export async function getUserProfile(userId) {
  // Mengambil profil user berdasarkan ID menggunakan RPC (SQL function)
  const { data, error } = await supabase.rpc('get_user_profile_by_id_admin', {
    user_id_input: userId
  }).single();
  if (error) {
    console.error("Gagal ambil profil (SQL):", error);
    return null;
  }
  return data;
}

export async function getUserByHandle(handle) {
  // Mengambil profil user berdasarkan handle menggunakan RPC
  const { data, error } = await supabase.rpc('get_user_profile_by_handle_admin', {
    handle_input: handle
  }).single();
  if (error) {
    console.error("Gagal ambil profil by handle (RPC):", error);
    return null;
  }
  return data;
}


// Upload avatar (foto profil)
export async function uploadAvatar(file) {
  // Pastikan user sudah login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Harus login untuk upload avatar.");
  }

  // Tentukan path file di bucket "avatars"
  const filePath = `${user.id}/${Date.now()}_${file.name}`;
  let newAvatarUrl = null;

  try {
    // Upload file ke storage Supabase
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);
    if (uploadError) {
      throw uploadError; // Lempar error ke catch di bawah
    }

    // Dapatkan URL publik file yang baru diupload
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    newAvatarUrl = urlData.publicUrl;
  } catch (error) {
    console.error("Gagal upload avatar (Storage Error):", error);
    // Lempar error agar bisa ditangani di komponen (mis. Pengaturan.jsx)
    throw new Error("Gagal upload foto profil. " + error.message);
  }

  try {
    // Simpan URL avatar baru ke tabel `users`
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: newAvatarUrl })
      .eq("id", user.id);
    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Gagal update profil (DB Error):", error);
    throw new Error("Upload foto berhasil, tapi gagal menyimpan ke profil. " + error.message);
  }

  return newAvatarUrl;
}

// Update data profil teks (nama, bio, dsb.)
export async function updateProfile(profileData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Harus login untuk update profil.");
  }

  // Update data di tabel users
  const { error } = await supabase
    .from("users")
    .update(profileData)
    .eq("id", user.id); 

  if (error) {
    console.error("Gagal update profil (teks):", error);
    throw error;
  }
}

// Upload foto banner profil
export async function uploadBanner(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Harus login untuk upload banner.");
  }

  // Simpan di folder khusus per-user, nama unik berdasarkan waktu
  const filePath = `${user.id}/banner_${Date.now()}_${file.name}`;
  let newBannerUrl = null;
  
  try {
    // Upload ke bucket "avatars" (bisa diganti jadi "banners" jika punya bucket terpisah)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file);
    if (uploadError) {
      throw uploadError;
    }

    // Ambil URL publik banner
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    newBannerUrl = urlData.publicUrl;
  } catch (error) {
    console.error("Gagal upload banner (Storage Error):", error);
    throw new Error("Gagal upload foto banner. " + error.message);
  }
  
  try {
    // Update URL banner di tabel users
    const { error: updateError } = await supabase
      .from("users")
      .update({ banner_url: newBannerUrl })
      .eq("id", user.id);
    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("Gagal update profil (DB Error):", error);
    throw new Error("Upload banner berhasil, tapi gagal menyimpan ke profil. " + error.message);
  }

  return newBannerUrl;
}


// Logout user dari Supabase
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Gagal logout:", error.message);
    alert("Gagal logout, silakan coba lagi.");
  } else {
    alert("Anda berhasil keluar!");
  }
}

// Update kata sandi user
export async function updateUserPassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) {
    console.error("Gagal update kata sandi:", error.message);
    alert("Gagal memperbarui kata sandi: " + error.message);
  } else {
    alert("Kata sandi Anda telah berhasil diperbarui!");
  }
}

// Kirim email reset password
export async function sendPasswordResetEmail(email) {
  const resetURL = 'http://localhost:3000/update-password.html'; 
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetURL,
  });
  if (error) {
    console.error("Gagal mengirim email reset:", error.message);
    alert("Gagal mengirim email reset: " + error.message);
  } else {
    alert("Email reset password telah dikirim! Silakan cek inbox Anda.");
  }
}
