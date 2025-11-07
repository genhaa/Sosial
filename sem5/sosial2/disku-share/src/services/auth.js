import { supabase } from "./supabase.js";

// --- REGISTER USER ---
export async function registerUser(fullName, email, password, handle) {
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

  // opsional: simpan ke tabel users
  if (data.user) {
    await supabase.from("users").insert([
      { id: data.user.id, name: fullName, email: email, handle: handle },
    ]);
  }
}

// --- LOGIN USER ---
export async function loginUser(email, password) {
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


// Fungsi untuk mengambil data profil lengkap
export async function getUserProfile(userId) {
  
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      name,
      email,
      handle,
      bio,
      avatar_url,
      banner_url,
      following_count:follows!follower_id ( count ),
      follower_count:follows!following_id ( count )
    `)    .eq("id", userId)
    .single(); // Ambil satu data saja

  if (error) {
    console.error("Gagal ambil profil:", error);
    return null;
  }

  // Proses datanya agar rapi
  const profile = {
    ...data,
    // `following_count` adalah jumlah orang yang SAYA ikuti
    following_count: data.following_count[0]?.count || 0,
    // `follower_count` adalah jumlah orang yang mengikuti SAYA
    follower_count: data.follower_count[0]?.count || 0,
  };
  
  return profile;
}

export async function uploadAvatar(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Harus login untuk upload avatar.");
    return null;
  }

  const filePath = `${user.id}/${Date.now()}_${file.name}`;

  // Langkah 1: Upload file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Gagal upload avatar:", uploadError);
    alert("Gagal upload foto.");
    return null;
  }

  // Langkah 2: Ambil URL publiknya
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);
  
  const newAvatarUrl = urlData.publicUrl;

  // Langkah 3 (BARU): Simpan URL ke database
  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: newAvatarUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Gagal update profil:", updateError);
    alert("Upload foto berhasil, tapi gagal menyimpan ke profil.");
    return null;
  }

  alert("Foto profil berhasil diperbarui!");
  return newAvatarUrl;
}

export async function updateProfile(profileData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("users")
    .update(profileData) 
    .eq("id", user.id); 

  if (error) {
    console.error("Gagal update profil:", error);
    alert("Gagal update profil.");
  } else {
    alert("Profil berhasil diperbarui!");
  }
}

export async function uploadBanner(file) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Harus login untuk upload banner.");
    return null;
  }

  const filePath = `${user.id}/banner_${Date.now()}_${file.name}`;

  // Langkah 1: Upload file
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Gagal upload banner:", uploadError);
    alert("Gagal upload foto banner.");
    return null;
  }

  // Langkah 2: Ambil URL publiknya
  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);
  
  const newBannerUrl = urlData.publicUrl;

  // Langkah 3 (BARU): Simpan URL ke database
  const { error: updateError } = await supabase
    .from("users")
    .update({ banner_url: newBannerUrl })
    .eq("id", user.id);

  if (updateError) {
    console.error("Gagal update profil:", updateError);
    alert("Upload banner berhasil, tapi gagal menyimpan ke profil.");
    return null;
  }

  alert("Banner profil berhasil diperbarui!");
  return newBannerUrl;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Gagal logout:", error.message);
    alert("Gagal logout, silakan coba lagi.");
  } else {
    alert("Anda berhasil keluar!");
  }
}

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
