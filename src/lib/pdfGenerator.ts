import jsPDF from 'jspdf';
import { ProjectBrief, Lead } from './types';

/**
 * Generate and download an executive PDF document for a single Project Brief (FRD)
 */
export function exportSingleBriefPDF(brief: ProjectBrief | Record<string, unknown>) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryBlue = [37, 99, 235]; // #2563EB
  const slateDark = [15, 23, 42]; // #0F172A
  const textMuted = [100, 116, 139]; // #64748B

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
 * Generate a comprehensive Master Report PDF of all Project Briefs for the Admin Dashboard
 */
export function exportAllBriefsPDF(briefs: ProjectBrief[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryBlue = [37, 99, 235];
  const slateDark = [15, 23, 42];
  const textMuted = [100, 116, 139];

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
    // Check if new page needed
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
