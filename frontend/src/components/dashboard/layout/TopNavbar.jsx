import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
} from "lucide-react";

const TopNavbar = ({
  onMenuClick,
  pageTitle = "Dashboard",
  pageDescription = "Welcome back! Here's what's happening today.",
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-6 lg:px-10">

        {/* Left Side */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-slate-900">
              {pageTitle}
            </h1>

            <p className="text-sm text-slate-500">
              {pageDescription}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="hidden w-full max-w-md lg:flex">
          <div className="relative w-full">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search pets, appointments..."
              className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                py-3
                pl-11
                pr-4
                outline-none
                transition
                focus:border-emerald-400
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-100
              "
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle */}
          <button
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-3
              transition
              hover:border-emerald-300
              hover:bg-emerald-50
            "
          >
            <Moon size={18} />
          </button>

          {/* Notifications */}
          <button
            className="
              relative
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-3
              transition
              hover:border-emerald-300
              hover:bg-emerald-50
            "
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </button>

          {/* User */}
          <button
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              transition
              hover:border-emerald-300
            "
          >
            <img
              src=""
              alt="Profile"
              className="h-11 w-11 rounded-xl object-cover"
            />

            <div className="hidden text-left lg:block">
              <p className="font-semibold text-slate-900">
                Shreyash
              </p>

              <p className="text-sm text-slate-500">
                Pet Parent
              </p>
            </div>

            <ChevronDown
              size={18}
              className="hidden text-slate-400 lg:block"
            />
          </button>

        </div>
      </div>
    </header>
  );
};

export default TopNavbar;