import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import { Heading, Paragraph } from "../../components/ui/Typography";
import ChatConsole from "./ChatConsole";

const AISection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-32" id="ai-assistant">
      {/* Background glow effects */}
      <div className="absolute top-1/3 right-10 h-[400px] w-[400px] rounded-full bg-emerald-100/30 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 left-10 h-[350px] w-[350px] rounded-full bg-cyan-100/25 blur-[100px] -z-10" />

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
              AI Care Assistant
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading className="mt-4">
              Instant Answers. Proactive Guidance.
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paragraph className="mt-6 mx-auto max-w-2xl text-slate-500">
              Get 24/7 personalized care recommendations for symptoms, diet, and training. 
              Powered by advanced clinical guidelines, verified by veterinary experts.
            </Paragraph>
          </motion.div>
        </div>

        {/* Live Chat Console Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10"
        >
          <ChatConsole />
        </motion.div>
      </Container>
    </section>
  );
};

export default AISection;
