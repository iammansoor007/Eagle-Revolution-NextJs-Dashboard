import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LeadCapture from "@/components/LeadCapture";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Mission from "@/components/Mission";
import TeamValues from "@/components/TeamValues";
import QAForm from "@/components/QAForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import AggressiveRoofingSection from "@/components/RoofingExperts";
import HowWeWork from "@/components/HowWeWork";
import QuickQuote from "@/components/QuickQuote"; // ✅ Import the QuickQuote widget

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative overflow-x-hidden">
      {/* ====================== */}
      {/* SUBTLE BLUE GRID BACKGROUND */}
      {/* ====================== */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary grid - very subtle */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #2563eb 1px, transparent 1px),
              linear-gradient(to bottom, #2563eb 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Secondary grid - even more subtle, offset */}
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            backgroundPosition: '30px 30px',
          }}
        />

        {/* Soft blue gradient overlays for depth */}
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-blue-50/10 to-transparent pointer-events-none" />
      </div>

      <AnimatePresence>
        {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          {/* All content with relative z-index to appear above grid */}
          <div className="relative z-10">
            <Navbar />
            <Hero />
            <section id="roofingexperts">
              <AggressiveRoofingSection />
            </section>
            <section id="services">
              <Services />
            </section>
            <TeamValues />
            <section id="portfolio">
              <Portfolio />
            </section>
            <Testimonials />
            <section id="about">
              <HowWeWork />
            </section>

            <section id="contact">
              <QAForm />
            </section>
            <section id="faq">
              <FAQ />
            </section>
            <Footer />

            {/* ✅ Quick Quote Widget - Only appears on Index page */}
            <QuickQuote />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;