"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      style={{ marginTop: 24, padding: 10, width: "100%", background: "#eee", border: "none", borderRadius: 4, cursor: "pointer" }}
      onClick={async () => {
        await signOut({ redirect: false });
        router.push("/login");
      }}
    >
      Logout
    </button>
  );
} 