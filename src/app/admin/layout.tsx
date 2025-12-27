import { AuthProvider } from "@/lib/auth-context";
import { AdminHeader } from "@/components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-dvh flex-col">
        <AdminHeader />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}
