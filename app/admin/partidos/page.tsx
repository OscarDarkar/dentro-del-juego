import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PartidosClient from "./PartidosClient";

export default async function PartidosPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return <PartidosClient />;
}
