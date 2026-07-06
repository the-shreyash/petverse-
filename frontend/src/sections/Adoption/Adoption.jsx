import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import { Heading, Paragraph } from "../../components/ui/Typography";
import AdoptionConsole from "./AdoptionConsole";

const Adoption = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-32" id="adoption-community">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-10 h-[450px] w-[450px] rounded-full bg-emerald-100/20 blur-[130px] -z-10" />
      <div className="absolute bottom-1/4 right-10 h-[350px] w-[350px] rounded-full bg-cyan-100/25 blur-[100px] -z-10" />

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
              Adoption & Community
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading className="mt-4">
              Building a Loving Pet Community
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paragraph className="mt-6 mx-auto max-w-2xl text-slate-500">
              Find pets looking for forever homes or raise real-time lost-and-found 
              alerts in your neighborhood to keep companions safe.
            </Paragraph>
          </motion.div>
        </div>

        {/* Adoption Console Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10"
        >
          <AdoptionConsole />
        </motion.div>
      </Container>
    </section>
  );
};

export default Adoption;
