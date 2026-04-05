import { useMemo } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

function BuyerLayout({ title, subtitle, actions, children }) {
  const authUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const topbarUserName = authUser?.name || "Buyer";
  const topbarUserRole = authUser?.role ? String(authUser.role).toUpperCase() : "BUYER";

  return (
    <div className="flex min-h-screen bg-[#edf0ee] text-[#1f2937]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={topbarUserName} userRole={topbarUserRole} />
        <main className="flex-1 p-6">
          {(title || subtitle || actions) && (
            <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {title && <h1 className="text-3xl font-semibold leading-tight text-[#143d35]">{title}</h1>}
                {subtitle && <p className="mt-1 text-sm text-[#6b7280]">{subtitle}</p>}
              </div>
              {actions && <div>{actions}</div>}
            </header>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export default BuyerLayout;
