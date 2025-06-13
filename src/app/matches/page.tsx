import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import MatchesManager from "../dashboard/MatchesManager";

export default async function MatchesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f7f9fb", padding: "40px 0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", color: "#1a202c" }}>
        <h1>Manage Matches</h1>
        <MatchesManager />
      </div>
    </div>
  );
} 