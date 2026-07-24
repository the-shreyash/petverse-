import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

const DashboardLayout = ({ children, pageTitle, pageDescription }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-24' : 'lg:ml-72'}`}>
        {/* Top navigation — every page passes its own title/description; these
            were previously dropped here, so all pages rendered "Dashboard". */}
        <TopNavbar onMenuClick={() => setCollapsed(!collapsed)} pageTitle={pageTitle} pageDescription={pageDescription} />

        {/* Page content */}
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeOut",
          }}
          className="px-6 py-8 lg:px-10"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
