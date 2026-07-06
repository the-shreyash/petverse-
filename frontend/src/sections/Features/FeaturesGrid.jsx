import {
  PawPrint,
  Brain,
  Camera,
  ShoppingCart,
  Hospital,
  HeartHandshake,
} from "lucide-react";

import FeatureItem from "./FeaturesItem";

const features = [
  {
    icon: PawPrint,
    title: "Pet Management",
    description:
      "Manage profiles, vaccinations, feeding schedules and complete health records.",
  },
  {
    icon: Brain,
    title: "AI Assistant",
    description:
      "Receive intelligent care guidance powered by AI.",
  },
  {
    icon: Camera,
    title: "Breed Detection",
    description:
      "Upload a photo and instantly identify breeds with AI.",
    large: true,
  },
  {
    icon: ShoppingCart,
    title: "Pet Shop",
    description:
      "Shop premium food, toys, medicines and accessories.",
  },
  {
    icon: Hospital,
    title: "Vet Booking",
    description:
      "Find nearby clinics and book appointments easily.",
  },
  {
    icon: HeartHandshake,
    title: "Adoption",
    description:
      "Adopt pets or report lost and found animals.",
    large: true,
  },
];

const FeatureGrid = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2">

      {features.map((feature) => (

        <FeatureItem
          key={feature.title}
          {...feature}
        />

      ))}

    </div>
  );
};

export default FeatureGrid;