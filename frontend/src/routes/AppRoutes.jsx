import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import DashboardHome from "../pages/dashboard/DashboardHome";
import MyPets from "../pages/pets/MyPets/MyPets";
import AddPet from "../pages/pets/AddPet/AddPet";
import PetDetails from "../pages/pets/PetDetails/PetDetails";
import EditPet from "../pages/pets/EditPet/EditPet";

// Health Domain Pages
import HealthDashboard from "../pages/health/Dashboard";
import MedicalRecordsView from "../pages/health/MedicalRecords";
import VaccinationsView from "../pages/health/Vaccinations";
import MedicationsView from "../pages/health/Medications";
import WeightTrackerView from "../pages/health/WeightTracker";
import VetAppointmentsView from "../pages/health/VetAppointments";
import EmergencyView from "../pages/health/Emergency";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyOTP />} />
      <Route path="/dashboard" element={<DashboardHome />} />
      
      {/* Pet Routes */}
      <Route path="/pets" element={<MyPets />} />
      <Route path="/pets/add" element={<AddPet />} />
      <Route path="/pets/new" element={<AddPet />} />
      <Route path="/pets/:id" element={<PetDetails />} />
      <Route path="/pets/:id/edit" element={<EditPet />} />

      {/* Health Domain Routes */}
      <Route path="/health" element={<HealthDashboard />} />
      <Route path="/health/records" element={<MedicalRecordsView />} />
      <Route path="/health/vaccinations" element={<VaccinationsView />} />
      <Route path="/health/medications" element={<MedicationsView />} />
      <Route path="/health/weight" element={<WeightTrackerView />} />
      <Route path="/health/appointments" element={<VetAppointmentsView />} />
      <Route path="/health/emergency" element={<EmergencyView />} />
      
      {/* Support sidebar appointment path typo */}
      <Route path="/appoinments" element={<VetAppointmentsView />} />
      <Route path="/appointments" element={<VetAppointmentsView />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
