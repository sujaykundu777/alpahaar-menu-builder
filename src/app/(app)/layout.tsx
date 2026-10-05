import AppProvider from "@/components/AppProvider";
import BottomNav from "@/components/BottomNav";
import DishModal from "@/components/DishModal";
import Header from "@/components/Header";
import Toast from "@/components/Toast";
import { signOut } from "@/app/actions";
import { loadAppData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const result = await loadAppData();

  if (result.status === "forbidden") {
    return (
      <div className="login-wrap">
        <div className="card">
          <h1 className="card-title">Access not allowed</h1>
          <p className="prices-description">
            {result.email} is signed in, but is not on this app&apos;s allowed list. Please ask the owner to add it.
          </p>
          <form action={signOut} style={{ marginTop: "1rem" }}>
            <button type="submit" className="save-button">Sign out</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AppProvider data={result.data}>
      <Header />
      <main>{children}</main>
      <BottomNav />
      <DishModal />
      <Toast />
    </AppProvider>
  );
}
