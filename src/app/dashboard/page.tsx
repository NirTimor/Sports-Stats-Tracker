import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", padding: "40px 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", color: "#1a202c" }}>
        <h2 style={{ marginBottom: 8 }}>Welcome, {session.user?.name || session.user?.email}!</h2>
        <p style={{ marginBottom: 24, color: "#555" }}>This is your dashboard. Here you can manage your sports data.</p>
        <DashboardContent />
      </div>
    </div>
  );
} 