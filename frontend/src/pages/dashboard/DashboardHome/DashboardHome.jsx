import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import MyPetsOverview from "./MyPetOverview";
import HealthSummary from "./HealthSummary";
import UpcomingVaccinations from "./UpcomingVaccinations";
import AiInsights from "./AiInsights";
import FeedingSchedule from "./FeedingSchedule";
import UpcomingAppointments from "./UpcomingAppointments";
import ActivityTimeline from "./ActivityTimeline";
import QuickActions from "./QuickActions";
import api from "@/services/api";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // GET /dashboard returns the aggregated summary for the authenticated user
        const response = await api.get("/dashboard");
        setStats(response.data.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-500">Loading Dashboard...</div>
      </DashboardLayout>
    );
  }

  const hasPets = stats?.stats?.total_pets > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardHeader />
        
        {!hasPets ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mb-6 rounded-full bg-emerald-50 p-6 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </div>
            <h2 className="mb-3 text-3xl font-bold text-slate-800">Welcome to PetVerse!</h2>
            <p className="mb-8 max-w-lg text-lg text-slate-500">
              Your journey starts here. Add your first pet to unlock personalized health tracking, AI insights, and a community of pet lovers.
            </p>
            <a href="/pets/add" className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 font-bold text-white shadow-lg transition-all hover:scale-105">
              Add Your First Pet
            </a>
          </div>
        ) : (
          <>
            <DashboardStats data={stats.stats} />
            <MyPetsOverview />
            <HealthSummary />
            <UpcomingVaccinations />
            <AiInsights />
            <FeedingSchedule />
            <UpcomingAppointments />
            <ActivityTimeline />
            <QuickActions />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;