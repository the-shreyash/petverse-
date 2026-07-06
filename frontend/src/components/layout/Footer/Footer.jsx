import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Container from "../../ui/Container";
import Button from "../../ui/Button";

const PRODUCT_LINKS = [
  { label: "AI CoPilot", href: "#ai-assistant" },
  { label: "Breed Lens", href: "#breed-detection" },
  { label: "Vet Bookings", href: "#vet-services" },
  { label: "Adoption Hub", href: "#adoption-community" }
];

const COMPANY_LINKS = [
  { label: "About Us", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Press Kit", href: "#" },
  { label: "Contact", href: "#" }
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Security", href: "#" }
];

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative border-t border-slate-200/50 bg-slate-50/40 py-20 overflow-hidden">
      {/* Background glow decorator */}
      <div className="absolute bottom-0 right-10 h-[300px] w-[300px] rounded-full bg-emerald-100/10 blur-[100px] -z-10" />

      <Container>
        <div className="grid gap-12 lg:grid-cols-6 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-black shadow-md">
                PV
              </div>
              PetVerse
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <p className="text-xs sm:text-sm leading-6 text-slate-500">
              One Platform. Complete Pet Care. Powered by AI.
              Building a modern, healthy ecosystem for pet parents across India.
            </p>

            {/* Newsletter input */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscribe to Newsletter</p>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
                <Button className="py-2.5 px-4 text-xs font-bold rounded-xl shrink-0" variant="primary">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Links Cols */}
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 lg:col-span-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Product</p>
              <ul className="space-y-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Company</p>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Legal</p>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <span>© 2026 PetVerse Inc. Made with</span>
            <Heart size={12} fill="#ef4444" color="#ef4444" className="animate-pulse" />
            <span>for pet parents.</span>
          </div>

          {/* Socials */}
          <div className="flex gap-4">
            {[
              { icon: TwitterIcon, href: "#" },
              { icon: GithubIcon, href: "#" },
              { icon: LinkedinIcon, href: "#" },
              { icon: YoutubeIcon, href: "#" }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ y: -3, scale: 1.05 }}
                className="text-slate-400 hover:text-slate-800 transition"
              >
                <social.icon />
              </motion.a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
