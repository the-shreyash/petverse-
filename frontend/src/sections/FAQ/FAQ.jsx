import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import { Heading, Paragraph } from "../../components/ui/Typography";
import FAQAccordion from "./FAQAccordion";

const FAQ = () => {
  return (
    <section className="relative overflow-hidden bg-white py-32" id="faq">
      {/* Background glow illustrations */}
      <div className="absolute top-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-emerald-100/20 blur-[135px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-cyan-100/25 blur-[110px] -z-10" />

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
              FAQ
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading className="mt-4">
              Frequently Asked Questions
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paragraph className="mt-6 mx-auto max-w-2xl text-slate-500">
              Have queries about PetVerse platforms, features, or veterinary networks? 
              Find detailed explanations below.
            </Paragraph>
          </motion.div>
        </div>

        {/* Accordions Showcase */}
        <div className="relative z-10">
          <FAQAccordion />
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
