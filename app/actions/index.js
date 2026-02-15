"use server";
import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function logout() {
  await signOut();
}

export async function updateLiveStatus(id, isLive) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections/${id}/live-status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isLive }),
      }
    );
    revalidatePath("/admin/dashboard/elections");
    revalidatePath(`/admin/dashboard/elections/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating election status:", error);
    return null;
  }
}

export async function updateStatus(id, status) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admin/elections/${id}/status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...status }),
      }
    );
    revalidatePath("/admin/dashboard/elections");
    revalidatePath(`/admin/dashboard/elections/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating election status:", error);
    return null;
  }
}
