import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import {
  Heading,
  Paragraph,
} from "../../components/ui/Typography";

import FeatureGrid from "./FeaturesGrid";

const Features = () => {
  return (
    <section className="py-32 bg-slate-50">

      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <Badge>

            Why PetVerse?

          </Badge>

          <Heading className="mt-6">

            Everything Your Pet Needs

          </Heading>

          <Paragraph className="mt-6">

            From AI-powered health guidance to shopping,
            veterinary care and pet adoption —
            everything is available in one intelligent ecosystem.

          </Paragraph>

        </div>

        <div className="mt-24">

          <FeatureGrid />

        </div>

      </Container>

    </section>
  );
};

export default Features;