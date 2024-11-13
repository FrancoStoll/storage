import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Siderbar from "@/components/Siderbar";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();


  if (!currentUser) redirect("/sing-in");
  return (
    <main className="flex h-screen">
      <Siderbar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} /> <Header {...currentUser} />
        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
}
