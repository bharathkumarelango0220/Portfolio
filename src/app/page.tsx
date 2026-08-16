import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeaturedProduct } from '@/components/FeaturedProduct';
import { ServicesSection } from '@/components/ServicesSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { WebsiteAuditLab } from '@/components/WebsiteAuditLab';
import { CaseStudiesSection } from '@/components/CaseStudiesSection';
import { ProjectBriefWizard } from '@/components/ProjectBriefWizard';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { MobileDock } from '@/components/MobileDock';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground mobile-safe-bottom">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* 1. High-Converting Hero */}
        <Hero />

        {/* 2. Flagship Product Spotlight: Trip Tools */}
        <FeaturedProduct />

        {/* 3. Core Services Breakdown */}
        <ServicesSection />

        {/* 4. 5-Step Transparent Risk-Free Process */}
        <ProcessTimeline />

        {/* 5. Interactive Website Audit & Architecture Lab */}
        <WebsiteAuditLab />

        {/* 6. Filterable Case Studies & Portfolio */}
        <CaseStudiesSection />

        {/* 7. Interactive 6-Step Project Brief (FRD) Wizard */}
        <ProjectBriefWizard />

        {/* 8. Direct Contact & Quick Inquiry Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Action Dock (Visible on Mobile/Tablet) */}
      <MobileDock />
    </div>
  );
}
