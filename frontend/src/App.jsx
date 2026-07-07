import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthRoutes from "./routes/AuthRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
    </Routes>
  );
}

export default App;