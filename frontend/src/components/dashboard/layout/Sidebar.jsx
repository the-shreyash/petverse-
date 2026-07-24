import { NavLink } from "react-router-dom";
import logo from "@/assets/logos/logo.png";
import {
  LayoutDashboard,
  PawPrint,
  HeartPulse,
  CalendarDays,
  Bot,
  ShoppingBag,
  Heart,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  Bell
} from "lucide-react";


const navigation =[
    {
        title : "Dashboard",
        icon: LayoutDashboard,
        path:"/dashboard",
    },
    {
        title:"My pet ",
        icon: PawPrint,
        path:"/pets",
    },
    {
        title: "Health",
        icon: HeartPulse,
        path:"/health",
    },
    {
        title:"Appoinments",
        icon:CalendarDays,
        path:"/appoinments",
    },
    {
        title:"AI Assistant",
        icon: Bot,
        path:"/ai",
    },
    {
        title:"Pet shop",
        icon: ShoppingBag,
        path:"/shop",
    },
    {
        title:"Community",
        icon: Users,
        path:"/community",
    },
    {
        title:"Adoption",
        icon:Heart,
        path:"/adoption",
    },
    {
        title:"Notifications",
        icon:Bell,
        path:"/notifications",
    },
    {
        title: "Settings",
        icon:Settings,
        path:"/settings",
    },

]

const Sidebar = ({
    collapsed = false,
    onToggle,
})=>{
    return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-40
        flex
        h-screen
        flex-col
        border-r
        border-slate-200/70
        bg-white/90
        backdrop-blur-xl
        transition-all
        duration-300
        ${
          collapsed
            ? "w-24"
            : "w-72"
        }
      `}
    >
      {/* Logo */}

      <div className="flex h-20 items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg p-1">
            <img src={logo} alt="PetVerse Logo" className="h-full w-full object-contain" />
          </div>

          {!collapsed && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                PetVerse
              </h2>

              <p className="text-sm text-slate-500">
                AI Pet Care
              </p>
            </div>
          )}

        </div>

        <button
          onClick={onToggle}
          className="rounded-xl p-2 transition hover:bg-slate-100"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

      </div>

      {/* Navigation */}

      <nav className="mt-6 flex-1 space-y-2 px-4">

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                rounded-2xl
                px-4
                py-3
                transition-all
                ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
                }
              `
              }
            >
              <Icon size={20} />

              {!collapsed && (
                <span className="font-medium">
                  {item.title}
                </span>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-200 p-5">

        {!collapsed ? (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 text-white">

            <p className="font-semibold">
              AI Care Tips
            </p>

            <p className="mt-1 text-sm text-white/80">
              Daily health insights for your pets.
            </p>

          </div>
        ) : (
          <div className="flex justify-center">
            <Bot className="text-emerald-500" />
          </div>
        )}

      </div>

    </aside>
  );
};

export default Sidebar;
