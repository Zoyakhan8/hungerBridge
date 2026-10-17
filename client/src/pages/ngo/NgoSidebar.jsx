import { NavLink } from "react-router-dom";
import {
  Building2,
  HandCoins,
  LayoutDashboard,
  TriangleAlert,
} from "lucide-react";

export const DEFAULT_NGO_NAVIGATION = [
  { label: "Dashboard", path: "/ngo", icon: LayoutDashboard },
  { label: "Donation Request", path: "/ngo/request", icon: Building2 },
  { label: "Donation Delivery", path: "/ngo/donation", icon: HandCoins },
  { label: "Donation History", path: "/ngo/donation-history", icon: HandCoins },
];

export const NgoSideBar = ({
  items = DEFAULT_NGO_NAVIGATION,
  mobileOpen = false,
  onNavigate,
  brand = "HungerBridge",
}) => (
  <>
    {/* Mobile backdrop */}
    {mobileOpen && (
      <button
        type="button"
        aria-label="Close navigation"
        onClick={() => onNavigate?.()}
        className="fixed inset-0 z-30 bg-black/30 md:hidden"
      />
    )}

    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[220px] shrink-0 flex-col border-r border-[#E8E5DA] bg-[#F4F2E9] px-4 py-5 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
        mobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:shadow-none"
      }`}
    >
      <div className="mb-8 px-1">
        <h2 className="font-app-heading text-2xl font-extrabold leading-tight text-[#B64B0C]">
          {brand}
        </h2>
        <p className="mt-1 font-app-body text-[8px] tracking-[0.18em] text-[#76695F]">
          NGO CONSOLE
        </p>
      </div>

      <nav className="space-y-2" aria-label="Ngo navigation">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/ngo"}
            onClick={() => onNavigate?.(label)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-3 font-app-body text-[12px] transition ${
                isActive
                  ? "bg-[#FF6D29] font-bold text-[#3A1B0D]"
                  : "text-[#55483F] hover:bg-white/80"
              }`
            }
          >
            {Icon && <Icon size={15} />}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-lg border border-[#E7E3D8] bg-[#FBF9F1] px-2.5 py-2">
        <p className="flex items-center gap-2 font-app-body text-[9px] text-[#3E5144]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          System Status: Active
        </p>
      </div>
    </aside>
  </>
);
