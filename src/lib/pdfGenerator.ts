import jsPDF from 'jspdf';
import { ProjectBrief, Lead } from './types';

const primaryBlue = [37, 99, 235]; // #2563EB
const slateDark = [15, 23, 42]; // #0F172A
const textMuted = [100, 116, 139]; // #64748B

/**
 * Generate and download an executive PDF document for a single Quick Contact Lead
 */
export function exportSingleLeadPDF(lead: Lead) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top Header Banner
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, 210, 26, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEXASSURE STUDIO', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Client Quick Contact & Lead Ingestion Record', 14, 18);
  doc.text(`Received: ${new Date(lead.createdAt).toLocaleDateString()}`, 155, 18);

  // Document Title
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`Lead Inquiry: ${lead.name}`, 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Source: ${lead.source || 'Website Contact Form'}  |  Status: ${lead.status.toUpperCase()}`, 14, 44);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 48, 196, 48);

  let y = 56;

  // Section: Contact Profile
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 32, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 32, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('1. CLIENT CONTACT INFORMATION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Client Full Name: ${lead.name}`, 18, y + 14);
  doc.text(`Email Address: ${lead.email}`, 18, y + 21);
  doc.text(`Phone / WhatsApp: ${lead.phone}`, 110, y + 14);
  doc.text(`Date & Time: ${new Date(lead.createdAt).toLocaleString()}`, 110, y + 21);

  y += 40;

  // Section: Inquiry Scope / Message
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('2. CLIENT MESSAGE & PROJECT REQUIREMENTS', 14, y);

  y += 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 45, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 45, 3, 3, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  const msg = lead.notes || 'Direct contact inquiry received through ApexAssure studio.';
  const msgLines = doc.splitTextToSize(msg, 172);
  doc.text(msgLines, 18, y + 8);

  y += 55;

  // Section: Next Steps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('3. RECOMMENDED ACTIONS & CONSULTATION STEPS', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('•  Initial Discovery Call / WhatsApp consultation with client', 18, y);
  doc.text('•  Review technical architecture and conversion goals', 18, y + 6);
  doc.text('•  Issue Formal Project Scope & Milestone Roadmap', 18, y + 12);

  // Footer note
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 275, 196, 275);
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('ApexAssure Studio • Contact: +91 8220802736 • bharathkumarelango02@gmail.com', 14, 282);
  doc.text('Page 1 of 1 • Confidential Record', 145, 282);

  const cleanName = lead.name.replace(/[^a-zA-Z0-9]/g, '_') || 'Lead';
  doc.save(`ApexAssure_Lead_${cleanName}.pdf`);
}

/**
 * Generate and download an executive PDF document for a single Project Brief (FRD)
 */
export function exportSingleBriefPDF(brief: ProjectBrief | Record<string, unknown>) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top Header Banner
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, 210, 26, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEXASSURE STUDIO', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Functional Requirements Document (FRD) & Project Brief', 14, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 18);

  // Document Title
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const businessName = String(brief.businessName || 'Project Brief');
  doc.text(businessName, 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Prepared by Bharathkumar E for ${brief.yourName || 'Client'}`, 14, 44);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 48, 196, 48);

  let y = 56;

  // Section: Client & Contact Info
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 28, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 28, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('1. CONTACT & CLIENT PROFILE', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Contact Person: ${brief.yourName || '—'}`, 18, y + 13);
  doc.text(`Email Address: ${brief.email || '—'}`, 18, y + 20);
  doc.text(`Phone / WhatsApp: ${brief.phone || '—'}`, 110, y + 13);
  doc.text(`Status: ${String(brief.status || 'New Brief').toUpperCase()}`, 110, y + 20);

  y += 35;

  // Section: Business Scope & Vision
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('2. BUSINESS OVERVIEW & OBJECTIVES', 14, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  const desc = String(brief.description || 'No description provided.');
  const descLines = doc.splitTextToSize(desc, 182);
  doc.text(descLines, 14, y);

  y += descLines.length * 4.5 + 4;

  const goals = Array.isArray(brief.goals) ? brief.goals.join(', ') : String(brief.goals || '—');
  doc.setFont('helvetica', 'bold');
  doc.text('Primary Goals:', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.text(goals, 45, y);

  y += 10;

  // Section: Target Audience & Visual Style
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 34, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 34, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('3. TARGET AUDIENCE & DESIGN DIRECTION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Target Demographic: ${brief.audienceGender || 'All'} (${brief.audienceAge || 'All ages'})`, 18, y + 14);
  doc.text(`Visual Aesthetic: ${brief.designLook || 'Modern & Minimalist'}`, 18, y + 21);
  doc.text(`Theme Mode: ${brief.colorTheme || 'Light & Dark Adaptive'}`, 18, y + 28);

  const colors = `${brief.primaryColor || 'Blue'} & ${brief.secondaryColor || 'Slate'}`;
  doc.text(`Preferred Colors: ${colors}`, 110, y + 14);
  doc.text(`Content Ready: ${brief.hasContent || 'Yes'}`, 110, y + 21);
  doc.text(`Domain Ready: ${brief.hasDomain || 'Yes'}`, 110, y + 28);

  y += 42;

  // Section: Selected Technical Features
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text('4. TECHNICAL CAPABILITIES & FEATURE CHECKLIST', 14, y);

  y += 6;
  const featuresList = Array.isArray(brief.keyFeatures) 
    ? brief.keyFeatures 
    : String(brief.keyFeatures || '').split(',').map(s => s.trim()).filter(Boolean);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

  featuresList.forEach((feature) => {
    doc.text(`•  ${feature}`, 18, y);
    y += 5.5;
  });

  // Footer note
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 275, 196, 275);

  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('ApexAssure Studio • Contact: +91 8220802736 • bharathkumarelango02@gmail.com', 14, 282);
  doc.text('Page 1 of 1 • 100% Risk-Free Guarantee', 145, 282);

  // Trigger browser download
  const cleanName = businessName.replace(/[^a-zA-Z0-9]/g, '_') || 'Project';
  doc.save(`ApexAssure_FRD_${cleanName}.pdf`);
}

/**
 * Generate a comprehensive Master Report PDF of all Project Briefs
 */
export function exportAllBriefsPDF(briefs: ProjectBrief[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEXASSURE STUDIO — ADMIN PORTAL', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Master Project Briefs Report • Total Submissions: ${briefs.length}`, 14, 18);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 155, 18);

  let y = 36;

  briefs.forEach((b, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 44, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 44, 3, 3, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.text(`${index + 1}. ${b.businessName}`, 18, y + 7);

    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Status: ${b.status.toUpperCase()} | Date: ${new Date(b.createdAt).toLocaleDateString()}`, 130, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`Client: ${b.yourName}  |  Email: ${b.email}  |  Phone: ${b.phone}`, 18, y + 14);

    const descSnippet = b.description.length > 110 ? b.description.substring(0, 107) + '...' : b.description;
    doc.text(`Scope: ${descSnippet}`, 18, y + 21);

    const goalsText = Array.isArray(b.goals) ? b.goals.join(', ') : b.goals;
    doc.text(`Goals: ${goalsText}`, 18, y + 28);

    const featuresText = Array.isArray(b.keyFeatures) ? b.keyFeatures.slice(0, 3).join(', ') + (b.keyFeatures.length > 3 ? '...' : '') : b.keyFeatures;
    doc.text(`Features: ${featuresText} | Style: ${b.designLook}`, 18, y + 35);

    y += 50;
  });

  // Footer note
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 280, 196, 280);
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('ApexAssure Master Lead & Brief Summary • Confidential', 14, 286);

  doc.save(`ApexAssure_Master_Briefs_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate a combined Master Executive PDF containing BOTH Quick Leads and Project Briefs
 */
export function exportAllSubmissionsPDF(leads: Lead[], briefs: ProjectBrief[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header Banner
  doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEXASSURE STUDIO — MASTER SUBMISSIONS REPORT', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Combined Ingestion: ${leads.length} Quick Leads + ${briefs.length} Project Briefs (Total: ${leads.length + briefs.length})`, 14, 19);
  doc.text(`Exported: ${new Date().toLocaleDateString()}`, 155, 19);

  let y = 38;

  // SECTION 1: QUICK CONTACT LEADS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text(`1. Quick Contact Inquiries (${leads.length})`, 14, y);
  y += 8;

  leads.forEach((l, idx) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 28, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 28, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`${idx + 1}. ${l.name}`, 18, y + 6);

    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Status: ${l.status.toUpperCase()}  |  ${new Date(l.createdAt).toLocaleDateString()}`, 130, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Email: ${l.email}  |  Phone: ${l.phone}`, 18, y + 13);
    
    const note = l.notes ? (l.notes.length > 90 ? l.notes.substring(0, 87) + '...' : l.notes) : 'Direct contact form inquiry.';
    doc.text(`Note: ${note}`, 18, y + 20);

    y += 33;
  });

  // SECTION 2: PROJECT BRIEFS (FRD)
  if (y > 220) {
    doc.addPage();
    y = 20;
  } else {
    y += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
  doc.text(`2. Detailed Project Briefs & FRDs (${briefs.length})`, 14, y);
  y += 8;

  briefs.forEach((b, idx) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 38, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 38, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`${idx + 1}. ${b.businessName}`, 18, y + 6);

    doc.setFontSize(8);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`Status: ${b.status.toUpperCase()}  |  ${new Date(b.createdAt).toLocaleDateString()}`, 130, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Client: ${b.yourName}  |  Email: ${b.email}  |  Phone: ${b.phone}`, 18, y + 13);
    doc.text(`Scope: ${b.description.length > 95 ? b.description.substring(0, 92) + '...' : b.description}`, 18, y + 20);
    
    const goalsText = Array.isArray(b.goals) ? b.goals.join(', ') : b.goals;
    doc.text(`Goals: ${goalsText}  |  Style: ${b.designLook}`, 18, y + 27);

    y += 44;
  });

  // Footer note
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 280, 196, 280);
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text('ApexAssure Master Lead & Brief Summary • Confidential Record', 14, 286);

  doc.save(`ApexAssure_Master_Submissions_${new Date().toISOString().slice(0, 10)}.pdf`);
}
