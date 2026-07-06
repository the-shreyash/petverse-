import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import { Heading, Paragraph } from "../../components/ui/Typography";
import BreedScanner from "./BreedScanner";

const BreedDetection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-32" id="breed-detection">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 h-[450px] w-[450px] rounded-full bg-teal-100/30 blur-[130px] -z-10" />
      <div className="absolute bottom-1/3 right-10 h-[350px] w-[350px] rounded-full bg-emerald-100/20 blur-[110px] -z-10" />

      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="primary" className="mb-6">
              AI Vision Lens
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading className="mt-4">
              Identify Breed & Behaviors in Seconds
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paragraph className="mt-6 mx-auto max-w-2xl text-slate-500">
              Simply upload a photo or hold up your phone camera. Our advanced 
              computer vision model identifies the breed mix and returns specific wellness insights.
            </Paragraph>
          </motion.div>
        </div>

        {/* Scanner Component Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10"
        >
          <BreedScanner />
        </motion.div>
      </Container>
    </section>
  );
};

export default BreedDetection;
