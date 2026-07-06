import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import Trusted from "./sections/Trusted";
import Features from "./sections/Features";
import DashboardPreview from "./sections/DashboardPreview";
import AISection from "./sections/AISection";
import BreedDetection from "./sections/BreedDetection";
import VetServices from "./sections/VetServices";
import Adoption from "./sections/Adoption";
import Testimonials from "./sections/Testimonials";
import FAQ from "./sections/FAQ";
import CTA from "./sections/CTA";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <>
      <Navbar />

      <Hero />
      

      <Trusted />
      <Features />
      <DashboardPreview />
      <AISection />
      <BreedDetection />
      <VetServices />
      <Adoption />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}

export default App;