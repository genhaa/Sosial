import { supabase } from "./supabase.js";

export async function blockUser(userIdToBlock) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("Anda harus login untuk memblokir!");
    return;
  }

  if (user.id === userIdToBlock) {
    console.warn("Tidak bisa memblokir diri sendiri.");
    return;
  }

  const { data, error } = await supabase
    .from("blocks")
    .insert([
      { 
        blocker_id: user.id, 
        blocked_id: userIdToBlock 
      }
    ]);

  if (error) {
    console.error("Gagal memblokir:", error.message);
  } else {
    console.log("Pengguna berhasil diblokir!");
  }
  return data;
}

export async function unblockUser(userIdToUnblock) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", user.id)
    .eq("blocked_id", userIdToUnblock);

  if (error) {
    console.error("Gagal batal-blokir:", error.message);
  } else {
    console.log("Berhasil batal-blokir!");
  }
  return data;
}
