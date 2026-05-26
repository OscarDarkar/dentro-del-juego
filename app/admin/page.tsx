import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return <AdminClient />;
}
