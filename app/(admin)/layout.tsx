"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Layanan", path: "/dashboard/services" },
    { name: "Booking", path: "/dashboard/bookings" },
    { name: "Produk", path: "/dashboard/products" },
    { name: "Pengaturan", path: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b px-4 py-3 flex justify-between items-center z-50 shadow-sm">
        <h1 className="text-xl font-bold text-green-700">Petshop Admin</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 border rounded-md">
          ☰
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h1 className="text-2xl font-bold text-green-700 tracking-tight">Petshop Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                pathname === item.path
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-3 mt-8 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 pt-24 md:pt-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}