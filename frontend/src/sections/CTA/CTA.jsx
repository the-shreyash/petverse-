import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Container from "../../components/ui/Container";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";
import GradientText from "../../components/ui/GradientText";

const CTA = () => {
  return (
    <section className="relative overflow-hidden py-32" id="cta">
      {/* Background glow graphics */}
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/30 blur-[130px] -z-10" />
      <div className="absolute top-12 left-10 h-[250px] w-[250px] rounded-full bg-teal-100/20 blur-[100px] -z-10" />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
          className="mx-auto max-w-5xl"
        >
          <GlassCard
            hover={false}
            className="relative border border-emerald-200/50 bg-white/95 px-8 py-16 text-center md:py-20 shadow-2xl overflow-hidden rounded-[30px]"
          >
            {/* Inner background grid design */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-10" />

            <div className="mx-auto max-w-3xl flex flex-col items-center">
              <Badge variant="primary" className="mb-6 flex items-center gap-1.5 font-bold">
                <Sparkles size={12} className="text-emerald-600" /> Start Today
              </Badge>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Ready to Give Your Pet the <br />
                <GradientText>Ultimate AI Care?</GradientText>
              </h2>

              <p className="mt-6 text-sm sm:text-base md:text-lg leading-8 text-slate-500 max-w-xl">
                Join thousands of pet owners who trust PetVerse for automated health logs, 
                instant breed scans, and emergency bookings.
              </p>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                <Button className="flex items-center justify-center gap-2 text-sm font-bold shadow-lg" variant="primary">
                  Get Started Free <ArrowRight size={16} />
                </Button>
                <Button className="text-sm font-bold border border-slate-200 bg-white hover:bg-slate-50" variant="secondary">
                  Contact Support
                </Button>
              </div>

              {/* Verified Trust Badges */}
              <div className="mt-12 border-t border-slate-100/60 pt-8 w-full max-w-md flex items-center justify-center gap-6 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" /> No Card Required
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" /> Free Setup
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </Container>
    </section>
  );
};

export default CTA;
