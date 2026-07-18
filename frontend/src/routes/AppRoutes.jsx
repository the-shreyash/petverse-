import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import OAuthCallback from "../pages/auth/OAuthCallback";
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
import DocumentsView from "../pages/health/Documents";
import TimelineView from "../pages/health/Timeline";

// AI Domain Pages
import AIHome from "../pages/ai/Home";
import AssistantView from "../pages/ai/Assistant";
import HealthAnalysisView from "../pages/ai/HealthAnalysis";
import BreedExpertView from "../pages/ai/BreedExpert";
import NutritionView from "../pages/ai/Nutrition";

// Shop Domain Pages
import ShopHome from "../pages/shop/Home";
import ProductDetailView from "../pages/shop/Product";
import CartView from "../pages/shop/Cart";
import WishlistView from "../pages/shop/Wishlist";
import CheckoutView from "../pages/shop/Checkout";
import OrdersView from "../pages/shop/Orders";

// Adoption & Settings Pages
import AdoptionView from "../pages/adoption/Adoption";
import SettingsView from "../pages/settings/Settings";

// Community Pages
import FeedPage from "../pages/community/Feed";
import PostDetailsPage from "../pages/community/PostDetails";
import TrendingPage from "../pages/community/Trending";
import LostFoundPage from "../pages/community/LostFound";
import AdoptionDetailsPage from "../pages/community/AdoptionDetails";
import ShelterProfilePage from "../pages/community/Shelters";
import MessagesPage from "../pages/community/Messages";

// Notifications Pages
import NotificationCenterPage from "../pages/notifications/Center";
import ReminderHistoryPage from "../pages/notifications/History";
import NotificationPreferencesPage from "../pages/notifications/Preferences";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify" element={<VerifyOTP />} />
      <Route path="/auth/oauth-callback" element={<OAuthCallback />} />
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
      <Route path="/health/documents" element={<DocumentsView />} />
      <Route path="/health/timeline" element={<TimelineView />} />

      {/* AI Domain Routes */}
      <Route path="/ai" element={<AIHome />} />
      <Route path="/ai/chat" element={<AssistantView />} />
      <Route path="/ai/health-analysis" element={<HealthAnalysisView />} />
      <Route path="/ai/breed-expert" element={<BreedExpertView />} />
      <Route path="/ai/nutrition" element={<NutritionView />} />

      {/* Shop Domain Routes */}
      <Route path="/shop" element={<ShopHome />} />
      <Route path="/shop/product/:id" element={<ProductDetailView />} />
      <Route path="/shop/cart" element={<CartView />} />
      <Route path="/shop/wishlist" element={<WishlistView />} />
      <Route path="/shop/checkout" element={<CheckoutView />} />
      <Route path="/shop/orders" element={<OrdersView />} />

      {/* Adoption & Settings Routes */}
      <Route path="/adoption" element={<AdoptionView />} />
      <Route path="/adoption/:id" element={<AdoptionDetailsPage />} />
      <Route path="/shelter/:id" element={<ShelterProfilePage />} />
      <Route path="/settings" element={<SettingsView />} />

      {/* Community Routes */}
      <Route path="/community" element={<FeedPage />} />
      <Route path="/community/post/:id" element={<PostDetailsPage />} />
      <Route path="/community/trending" element={<TrendingPage />} />
      <Route path="/community/lost-found" element={<LostFoundPage />} />
      <Route path="/community/messages" element={<MessagesPage />} />

      {/* Notifications Routes */}
      <Route path="/notifications" element={<NotificationCenterPage />} />
      <Route path="/notifications/history" element={<ReminderHistoryPage />} />
      <Route path="/notifications/preferences" element={<NotificationPreferencesPage />} />
      
      {/* Support sidebar appointment path typo */}
      <Route path="/appoinments" element={<VetAppointmentsView />} />
      <Route path="/appointments" element={<VetAppointmentsView />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
