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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
