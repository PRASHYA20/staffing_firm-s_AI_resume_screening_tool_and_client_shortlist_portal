import os
import re
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Preformatted, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        if self._pageNumber > 1:
            self.saveState()
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            
            # Running Header
            self.drawString(54, 11 * inch - 36, "TalentPulse AI — Enterprise Technical Design Document (TDD)")
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "Confidential Architectural Specification")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)
            
            # Running Footer
            self.line(54, 46, 8.5 * inch - 54, 46)
            self.drawString(54, 34, "Digital Personal Data Protection (DPDP) Act 2023 Compliant Architecture")
            page_str = f"Page {self._pageNumber} of {total_pages}"
            self.drawRightString(8.5 * inch - 54, 34, page_str)
            self.restoreState()

def build_pdf():
    md_path = os.path.join(os.path.dirname(__file__), "Technical_Design_Document.md")
    pdf_path = os.path.join(os.path.dirname(__file__), "Technical_Design_Document.pdf")
    
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#4F46E5")     # Indigo
    c_navy = colors.HexColor("#0F172A")        # Slate 900
    c_charcoal = colors.HexColor("#1E293B")    # Slate 800
    c_body = colors.HexColor("#334155")        # Slate 700
    c_muted = colors.HexColor("#64748B")       # Slate 500
    c_border = colors.HexColor("#E2E8F0")      # Slate 200
    c_bg_subtle = colors.HexColor("#F8FAFC")   # Slate 50

    p_style_body = ParagraphStyle(
        'DocBody',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_body,
        spaceAfter=4
    )
    
    p_style_bullet = ParagraphStyle(
        'DocBullet',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=c_body,
        leftIndent=16,
        firstLineIndent=-10,
        spaceAfter=3
    )

    p_style_h1 = ParagraphStyle(
        'DocH1',
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_navy,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True
    )

    p_style_h2 = ParagraphStyle(
        'DocH2',
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    p_style_h3 = ParagraphStyle(
        'DocH3',
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_charcoal,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    p_style_code_block = ParagraphStyle(
        'DocCode',
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=c_navy
    )

    p_style_table_header = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    p_style_table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8.0,
        leading=10.5,
        textColor=c_body
    )

    story = []

    # ==========================
    # 1. TITLE PAGE
    # ==========================
    story.append(Spacer(1, 0.4 * inch))
    
    kicker_style = ParagraphStyle(
        'TitleKicker',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=c_primary,
        spaceAfter=8
    )
    story.append(Paragraph("ENTERPRISE TECHNICAL DESIGN DOCUMENT (TDD)", kicker_style))
    
    main_title_style = ParagraphStyle(
        'MainTitle',
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=30,
        textColor=c_navy,
        spaceAfter=6
    )
    story.append(Paragraph("TalentPulse AI", main_title_style))
    
    sub_title_style = ParagraphStyle(
        'SubTitle',
        fontName='Helvetica',
        fontSize=13,
        leading=17,
        textColor=c_muted,
        spaceAfter=20
    )
    story.append(Paragraph("AI-Powered Resume Screening & Client Shortlist Portal<br/>System Architecture, Data Models, Matching Engine & Statutory Governance", sub_title_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=0, spaceAfter=18))

    # Title Page Metadata Table
    meta_data = [
        [Paragraph("<b>GitHub Repository</b>", p_style_table_cell), Paragraph('<font color="#4F46E5"><u>https://github.com/PRASHYA20/staffing_firm-s_AI_resume_screening_tool_and_client_shortlist_portal</u></font>', p_style_table_cell)],
        [Paragraph("<b>Live Dev Instance</b>", p_style_table_cell), Paragraph("http://localhost:5175/ (Vite) • http://localhost:3001/ (Express REST API)", p_style_table_cell)],
        [Paragraph("<b>Target Enterprise Context</b>", p_style_table_cell), Paragraph("Company A, Noida (70 Recruiters, 300 Requisitions/mo, ₹40–50 Cr Annual Revenue)", p_style_table_cell)],
        [Paragraph("<b>Document Version & Status</b>", p_style_table_cell), Paragraph("v3.0.0 (Comprehensive Verified Architecture Baseline)", p_style_table_cell)],
        [Paragraph("<b>Publication Date</b>", p_style_table_cell), Paragraph("November 2026", p_style_table_cell)],
        [Paragraph("<b>Lead Systems Architect</b>", p_style_table_cell), Paragraph("Senior Software Architect & Technical Documentation Specialist", p_style_table_cell)],
        [Paragraph("<b>Compliance Standard</b>", p_style_table_cell), Paragraph("Digital Personal Data Protection (DPDP) Act 2023 (Sections 4, 7, 8, 11, and 12)", p_style_table_cell)]
    ]
    meta_table = Table(meta_data, colWidths=[2.0 * inch, 4.8 * inch])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor("#F1F5F9")),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('TEXTCOLOR', (0, 0), (-1, -1), c_body),
        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.3 * inch))

    # Executive Callout on Cover
    callout_data = [[Paragraph("<b>EXECUTIVE MANDATE & AUDIT NOTE:</b><br/>This document accurately describes the implementation verified within the repository. It explicitly distinguishes between operational rule-based algorithms, deterministic NLP extraction, data models, and future cloud integrations. All simulated metrics and demo datasets are transparently identified in accordance with enterprise software engineering standards.", p_style_body)]]
    callout_table = Table(callout_data, colWidths=[6.8 * inch])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#EEF2FF")),
        ('BOX', (0, 0), (0, 0), 1.0, colors.HexColor("#C7D2FE")),
        ('LINEBEFORE', (0, 0), (0, 0), 3.0, c_primary),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ]))
    story.append(callout_table)
    story.append(PageBreak())

    # ==========================
    # 2. BODY CONTENT PARSER
    # ==========================
    lines = md_text.split("\n")
    start_idx = 0
    for idx, line in enumerate(lines):
        if line.strip().startswith("## Executive Summary"):
            start_idx = idx
            break

    body_lines = lines[start_idx:]
    i = 0
    in_code = False
    code_lines = []
    table_lines = []

    def clean_text_for_pdf(raw):
        # Convert markdown bold/italics/code to reportlab tags
        txt = raw.strip()
        # Escape html entities
        txt = txt.replace("&", "&amp;")
        txt = txt.replace("<", "&lt;").replace(">", "&gt;")
        
        # Restore and convert tags
        txt = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", txt)
        txt = re.sub(r"`(.*?)`", r'<font face="Courier" color="#4F46E5">\1</font>', txt)
        txt = re.sub(r"\*(.*?)\*", r"<i>\1</i>", txt)
        return txt

    while i < len(body_lines):
        line = body_lines[i]
        s_line = line.strip()

        # Handle Code Blocks
        if s_line.startswith("```"):
            if in_code:
                in_code = False
                raw_code = "\n".join(code_lines)
                code_p = Preformatted(raw_code, p_style_code_block)
                c_tbl = Table([[code_p]], colWidths=[6.8 * inch])
                c_tbl.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), c_bg_subtle),
                    ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                    ('TOPPADDING', (0, 0), (-1, -1), 6),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('LEFTPADDING', (0, 0), (-1, -1), 8),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ]))
                story.append(Spacer(1, 4))
                story.append(c_tbl)
                story.append(Spacer(1, 6))
                code_lines = []
            else:
                in_code = True
                code_lines = []
            i += 1
            continue

        if in_code:
            code_lines.append(line)
            i += 1
            continue

        # Handle Tables
        if s_line.startswith("|") and s_line.endswith("|"):
            table_lines.append(s_line)
            i += 1
            if i < len(body_lines) and body_lines[i].strip().startswith("|"):
                continue
            else:
                # Render table
                filtered = []
                for tl in table_lines:
                    if re.match(r"^\|(\s*:?-+:?\s*\|)+$", tl):
                        continue
                    cols = [clean_text_for_pdf(p) for p in tl.split("|")[1:-1]]
                    filtered.append(cols)
                
                if filtered:
                    num_c = max(len(r) for r in filtered)
                    col_w = (6.8 * inch) / num_c
                    tbl_data = []
                    for r_idx, r in enumerate(filtered):
                        row_p = []
                        for c_idx in range(num_c):
                            val = r[c_idx] if c_idx < len(r) else ""
                            if r_idx == 0:
                                row_p.append(Paragraph(val, p_style_table_header))
                            else:
                                row_p.append(Paragraph(val, p_style_table_cell))
                        tbl_data.append(row_p)
                        
                    t_obj = Table(tbl_data, colWidths=[col_w] * num_c)
                    t_style = [
                        ('BACKGROUND', (0, 0), (-1, 0), c_charcoal),
                        ('GRID', (0, 0), (-1, -1), 0.5, c_border),
                        ('TOPPADDING', (0, 0), (-1, -1), 4),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
                        ('LEFTPADDING', (0, 0), (-1, -1), 5),
                        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                    ]
                    for r_idx in range(1, len(tbl_data)):
                        if r_idx % 2 == 0:
                            t_style.append(('BACKGROUND', (0, r_idx), (-1, r_idx), c_bg_subtle))
                        else:
                            t_style.append(('BACKGROUND', (0, r_idx), (-1, r_idx), colors.white))
                    t_obj.setStyle(TableStyle(t_style))
                    story.append(Spacer(1, 4))
                    story.append(t_obj)
                    story.append(Spacer(1, 6))
                table_lines = []
                continue

        # Handle Headings
        if s_line.startswith("# "):
            story.append(Spacer(1, 10))
            story.append(Paragraph(clean_text_for_pdf(s_line[2:]), p_style_h1))
            story.append(HRFlowable(width="100%", thickness=0.8, color=c_border, spaceBefore=2, spaceAfter=8))
            i += 1
            continue

        if s_line.startswith("## "):
            story.append(Spacer(1, 8))
            story.append(Paragraph(clean_text_for_pdf(s_line[3:]), p_style_h2))
            i += 1
            continue

        if s_line.startswith("### "):
            story.append(Spacer(1, 6))
            story.append(Paragraph(clean_text_for_pdf(s_line[4:]), p_style_h3))
            i += 1
            continue

        if s_line.startswith("#### "):
            h4_style = ParagraphStyle('DocH4', parent=p_style_h3, fontSize=9.5, textColor=c_muted)
            story.append(Paragraph(clean_text_for_pdf(s_line[5:]), h4_style))
            i += 1
            continue

        # Horizontal rule
        if s_line in ["---", "***"]:
            story.append(HRFlowable(width="100%", thickness=0.5, color=c_border, spaceBefore=6, spaceAfter=6))
            i += 1
            continue

        if not s_line:
            i += 1
            continue

        # Bullets and List Items
        if s_line.startswith("- ") or s_line.startswith("* "):
            content = clean_text_for_pdf(s_line[2:])
            bullet_html = f'<font color="#4F46E5">&bull;</font>  {content}'
            story.append(Paragraph(bullet_html, p_style_bullet))
            i += 1
            continue

        if re.match(r"^\d+\.\s+", s_line):
            num_match = re.match(r"^(\d+\.)\s+(.*)$", s_line)
            num_str = num_match.group(1)
            content = clean_text_for_pdf(num_match.group(2))
            item_html = f'<b><font color="#4F46E5">{num_str}</font></b>  {content}'
            story.append(Paragraph(item_html, p_style_bullet))
            i += 1
            continue

        # Normal paragraph
        story.append(Paragraph(clean_text_for_pdf(s_line), p_style_body))
        i += 1

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {pdf_path}")

if __name__ == "__main__":
    build_pdf()

