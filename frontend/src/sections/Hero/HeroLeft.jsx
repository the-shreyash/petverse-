import { motion } from "framer-motion";

import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

import {
  Display,
  Paragraph,
} from "../../components/ui/Typography";

import GradientText from "../../components/ui/GradientText";

import {
  Play,
  Star,
} from "lucide-react";

const HeroLeft = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: .8,
      }}
      className="space-y-8"
    >
      {/* Badge */}

      <Badge>
        🐾 AI Powered Pet Care
      </Badge>

      {/* Heading */}

      <Display>

        One Platform.

        <br />

        <GradientText>

          Complete Pet Care.

        </GradientText>

        <br />

        Powered by AI.

      </Display>

      {/* Description */}

      <Paragraph className="max-w-xl">

        Manage pets, monitor health, identify breeds,
        shop products and receive intelligent AI-powered
        care guidance—all from one beautiful platform.

      </Paragraph>

      {/* Buttons */}

      <div className="flex flex-wrap gap-5">

        <Button>

          Get Started

        </Button>

        <Button variant="secondary">

          <div className="flex items-center gap-2">

            <Play
              size={18}
              fill="currentColor"
            />

            Watch Demo

          </div>

        </Button>

      </div>

      {/* Rating */}

      <div className="flex items-center gap-5">

        <div className="flex">

          {Array.from({ length: 5 }).map((_, index) => (

            <Star
              key={index}
              size={18}
              fill="#FACC15"
              color="#FACC15"
            />

          ))}

        </div>

        <p className="font-medium text-gray-600">

          Trusted by <span className="font-bold">10,000+</span> Pet Owners

        </p>

      </div>

    </motion.div>
  );
};

export default HeroLeft;