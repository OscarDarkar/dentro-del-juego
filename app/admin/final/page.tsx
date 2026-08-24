import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import FinalClient from "./FinalClient";

export default async function FinalPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return <FinalClient />;
}
