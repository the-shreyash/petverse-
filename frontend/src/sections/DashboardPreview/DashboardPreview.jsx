import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import { Heading, Paragraph } from "../../components/ui/Typography";
import DashboardMockup from "./DashboardMockup";

const DashboardPreview = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-32" id="dashboard-preview">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/40 blur-[120px] -z-10" />
      <div className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-teal-100/30 blur-[100px] -z-10" />

      <Container>
        <div className="mx-auto max-w-4xl text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6">
              Dashboard Control
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Heading className="mt-4">
              All-in-One Command Center for Your Pet
            </Heading>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paragraph className="mt-6 mx-auto max-w-2xl text-slate-500">
              Manage complete health records, monitor daily activity, and receive 
              proactive AI guidance—all unified under a single, gorgeous dashboard.
            </Paragraph>
          </motion.div>
        </div>

        {/* Mockup Showcase Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <DashboardMockup />
        </motion.div>
      </Container>
    </section>
  );
};

export default DashboardPreview;
