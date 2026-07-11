import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#f8f7fd]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content wrapper */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <Header />

        {/* Dashboard page contents */}
        <main className="flex-1 px-6 pb-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
