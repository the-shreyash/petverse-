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





const DashboardHome = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <DashboardHeader />
          
        <DashboardStats />
        <MyPetsOverview/>
        <HealthSummary/>

        <UpcomingVaccinations />
        <AiInsights/>
        <FeedingSchedule/>

        <UpcomingAppointments/>

        <ActivityTimeline/>
        <QuickActions/>

      </div>
    </DashboardLayout>
    
    

  );
};

export default DashboardHome;