import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full clay-bg overflow-hidden p-0 lg:p-4 lg:gap-4">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content wrapper */}
      <div className="flex flex-1 flex-col min-w-0 h-full">
        {/* Header */}
        <Header />

        {/* Dashboard page contents */}
        <main className="flex-1 px-6 pb-8 lg:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
