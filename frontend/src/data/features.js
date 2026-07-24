import {
  PawPrint,
  Brain,
  Camera,
  ShoppingCart,
  Hospital,
  HeartHandshake,
  Search,
} from "lucide-react";

/**
 * Single source of truth for the landing page feature cards.
 *
 * Every card (front + 3D flip back) renders dynamically from this file.
 * Each feature has UNIQUE content — no shared/duplicated copy.
 *
 * Shape:
 *   icon              lucide-react icon component
 *   title             feature name (front + back headline)
 *   shortDescription  one-line summary shown on the front
 *   howItWorks        ordered step-by-step list shown on the back
 *   benefits          bullet list of outcomes shown on the back
 *   route             React Router path used by "Get Started"
 *   image             preview image (used as a subtle back-side header)
 *   large             optional — spans two grid columns
 */
export const features = [
  {
    id: "pet-management",
    icon: PawPrint,
    title: "Pet Management",
    shortDescription:
      "Manage profiles, vaccinations, feeding schedules and complete health records.",
    howItWorks: [
      "Create a pet profile",
      "Upload a pet photo",
      "Add vaccinations",
      "Set a feeding schedule",
      "Enable grooming reminders",
      "Store full medical history",
    ],
    benefits: [
      "AI recommendations",
      "Smart reminders",
      "Health tracking",
      "Secure storage",
    ],
    route: "/pets",
    image:
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "ai-assistant",
    icon: Brain,
    title: "AI Assistant",
    shortDescription: "Receive intelligent care guidance powered by AI.",
    howItWorks: [
      "Ask a question about your pet",
      "Share breed, age and symptoms",
      "AI analyzes your pet's context",
      "Get personalized care guidance",
      "Follow suggested next steps",
      "Save advice to your pet's record",
    ],
    benefits: [
      "24/7 instant answers",
      "Tailored to your pet",
      "Symptom guidance",
      "Peace of mind anytime",
    ],
    route: "/ai-assistant",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "breed-detection",
    icon: Camera,
    title: "Breed Detection",
    shortDescription:
      "Upload a photo and instantly identify breeds with AI.",
    howItWorks: [
      "Upload a clear photo of your pet",
      "AI scans key physical traits",
      "Match against 300+ breeds",
      "Receive the likely breed mix",
      "Review health predispositions",
      "Explore personality insights",
    ],
    benefits: [
      "95% breed accuracy",
      "Health risk insights",
      "Personality profile",
      "Detailed breed reports",
    ],
    route: "/breed-detection",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600",
    large: true,
  },
  {
    id: "pet-shop",
    icon: ShoppingCart,
    title: "Pet Shop",
    shortDescription:
      "Shop premium food, toys, medicines and accessories.",
    howItWorks: [
      "Browse curated categories",
      "Filter by your pet's needs",
      "Add products to your cart",
      "Checkout securely",
      "Track your order in real time",
      "Reorder favourites in one tap",
    ],
    benefits: [
      "Premium curated products",
      "Fast home delivery",
      "Secure checkout",
      "Easy reordering",
    ],
    route: "/shop",
    image:
      "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "vet-booking",
    icon: Hospital,
    title: "Vet Booking",
    shortDescription:
      "Find nearby clinics and book appointments easily.",
    howItWorks: [
      "Search verified clinics near you",
      "Compare ratings and reviews",
      "Pick an available time slot",
      "Book instantly, no prepayment",
      "Receive a confirmation reminder",
      "Manage or reschedule anytime",
    ],
    benefits: [
      "Verified nearby vets",
      "Instant booking",
      "No prepayment required",
      "Real user reviews",
    ],
    route: "/vet-services",
    image:
      "https://images.unsplash.com/photo-1628009368231-7bb7cbcb8127?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "adoption",
    icon: HeartHandshake,
    title: "Adoption",
    shortDescription: "Adopt a pet or connect with local shelters.",
    howItWorks: [
      "Browse pets available for adoption",
      "Filter by breed, age and location",
      "View each pet's full profile",
      "Message the shelter directly",
      "Schedule a meet-and-greet",
      "Complete the adoption process",
    ],
    benefits: [
      "Give a pet a loving home",
      "Verified local shelters",
      "Direct messaging",
      "Guided adoption support",
    ],
    route: "/adoption",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=600",
    large: true,
  },
  {
    id: "lost-found",
    icon: Search,
    title: "Lost & Found",
    shortDescription:
      "Report lost pets and reunite found animals with their owners.",
    howItWorks: [
      "Report a lost or found pet",
      "Add photos and last-seen location",
      "Alert the nearby community",
      "Receive matching sighting reports",
      "Message people who spotted the pet",
      "Mark as reunited when found",
    ],
    benefits: [
      "Instant community alerts",
      "Location-based matching",
      "Direct sighting messages",
      "Faster reunions",
    ],
    route: "/forgotten-pets",
    image:
      "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&q=80&w=600",
  },
];

export default features;
