import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import { Heading, Paragraph } from "../../components/ui/Typography";
import TestimonialGrid from "./TestimonialGrid";

const Testimonials = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-32" id="testimonials">
      {/* Background glow animations */}
      <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-cyan-100/20 blur-[130px] -z-10" />
      <div className="absolute bottom-1/4 right-10 h-[350px] w-[350px] rounded-full bg-emerald-100/20 blur-[110px] -z-10" />

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
              Testimonials
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading className="mt-4">
              Loved by Thousands of Pet Parents
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paragraph className="mt-6 mx-auto max-w-2xl text-slate-500">
              Read how PetVerse is helping owners across India provide premium 
              and stress-free healthcare for their animal companions.
            </Paragraph>
          </motion.div>
        </div>

        {/* Testimonials Grid Showcase */}
        <div className="relative z-10">
          <TestimonialGrid />
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
