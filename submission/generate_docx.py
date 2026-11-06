import os
import re
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_callout(doc, text_lines, title="ARCHITECTURAL NOTE"):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    
    cell = table.cell(0, 0)
    cell.width = Inches(6.5)
    set_cell_background(cell, "F1F5F9")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="none"/><w:left w:val="single" w:sz="24" w:space="0" w:color="4F46E5"/><w:bottom w:val="none"/><w:right w:val="none"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_t = p.add_run(f"■ {title}\n")
    run_t.bold = True
    run_t.font.size = Pt(9.5)
    run_t.font.color.rgb = RGBColor(79, 70, 229)
    
    for idx, l in enumerate(text_lines):
        run = p.add_run(l)
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(30, 41, 59)
        if idx < len(text_lines) - 1:
            p.add_run("\n")
            
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def build_docx():
    md_path = os.path.join(os.path.dirname(__file__), "Technical_Design_Document.md")
    docx_path = os.path.join(os.path.dirname(__file__), "Technical_Design_Document.docx")
    
    with open(md_path, "r", encoding="utf-8") as f:
        md_text = f.read()

    doc = Document()
    
    # Page setup - Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.85)
        section.right_margin = Inches(0.85)
        
        # Header / Footer
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        frun = fp.add_run("TalentPulse AI — Technical Design Document (TDD) | Confidential")
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(148, 163, 184)
        
    # Styles
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)
    
    # TITLE PAGE
    p_pre = doc.add_paragraph()
    p_pre.paragraph_format.space_before = Pt(36)
    
    p_kicker = doc.add_paragraph()
    r_kicker = p_kicker.add_run("ENTERPRISE TECHNICAL SPECIFICATION & ARCHITECTURE")
    r_kicker.font.size = Pt(11)
    r_kicker.font.bold = True
    r_kicker.font.color.rgb = RGBColor(79, 70, 229)
    
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(8)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("TalentPulse AI")
    r_title.font.size = Pt(30)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(15, 23, 42)
    
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_after = Pt(24)
    r_sub = p_sub.add_run("AI-Powered Resume Screening & Client Shortlist Portal\nTechnical Design Document (TDD)")
    r_sub.font.size = Pt(15)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(71, 85, 105)
    
    # Metadata Box on Title Page
    meta_table = doc.add_table(rows=7, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    
    metadata_rows = [
        ("GitHub Repository", "https://github.com/PRASHYA20/staffing_firm-s_AI_resume_screening_tool_and_client_shortlist_portal"),
        ("Live Development Instance", "http://localhost:5175/ (Vite) • http://localhost:3001/ (Express REST API)"),
        ("Target Enterprise Context", "Company A, Noida (70 Recruiters, 300 Requisitions/mo, ₹40–50 Cr Revenue)"),
        ("Document Version & Baseline", "v3.0.0 (Comprehensive Verified Architecture Baseline)"),
        ("Publication Date", "November 2026"),
        ("Lead Systems Architect", "Senior Software Architect & Technical Documentation Specialist"),
        ("Compliance Standard", "Digital Personal Data Protection (DPDP) Act 2023 (Sections 4, 7, 8, 11, 12)")
    ]
    
    for i, (k, v) in enumerate(metadata_rows):
        row = meta_table.rows[i]
        c0 = row.cells[0]
        c1 = row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(4.3)
        set_cell_background(c0, "F8FAFC")
        set_cell_background(c1, "FFFFFF")
        set_cell_margins(c0, 80, 80, 100, 100)
        set_cell_margins(c1, 80, 80, 100, 100)
        
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(k)
        r0.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = RGBColor(51, 65, 85)
        
        p1 = c1.paragraphs[0]
        r1 = p1.add_run(v)
        r1.font.size = Pt(9.5)
        if "http" in v:
            r1.font.color.rgb = RGBColor(79, 70, 229)
            r1.underline = True
        else:
            r1.font.color.rgb = RGBColor(15, 23, 42)
            
    doc.add_page_break()
    
    # Process Markdown content line by line
    lines = md_text.split("\n")
    i = 0
    in_code_block = False
    code_block_lines = []
    in_table = False
    table_lines = []
    
    # Skip Title Page lines from MD since already created
    # Find where Table of Contents or Executive Summary starts
    start_idx = 0
    for idx, line in enumerate(lines):
        if line.strip().startswith("## Executive Summary"):
            start_idx = idx
            break
            
    lines_to_process = lines[start_idx:]
    
    while i < len(lines_to_process):
        line = lines_to_process[i]
        raw_strip = line.strip()
        
        # Handle code blocks
        if raw_strip.startswith("```"):
            if in_code_block:
                in_code_block = False
                # Render code block
                tbl = doc.add_table(rows=1, cols=1)
                tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                c = tbl.cell(0, 0)
                c.width = Inches(6.5)
                set_cell_background(c, "F8FAFC")
                set_cell_margins(c, 100, 100, 120, 120)
                cp = c.paragraphs[0]
                cp.paragraph_format.line_spacing = 1.05
                cp.paragraph_format.space_before = Pt(2)
                cp.paragraph_format.space_after = Pt(2)
                
                c_text = "\n".join(code_block_lines)
                c_run = cp.add_run(c_text)
                c_run.font.name = "Consolas"
                c_run.font.size = Pt(8.0)
                c_run.font.color.rgb = RGBColor(15, 23, 42)
                
                p_spacer = doc.add_paragraph()
                p_spacer.paragraph_format.space_after = Pt(4)
                code_block_lines = []
            else:
                in_code_block = True
                code_block_lines = []
            i += 1
            continue
            
        if in_code_block:
            code_block_lines.append(line)
            i += 1
            continue
            
        # Handle tables
        if raw_strip.startswith("|") and raw_strip.endswith("|"):
            table_lines.append(raw_strip)
            i += 1
            # Check if next line is table
            if i < len(lines_to_process) and lines_to_process[i].strip().startswith("|"):
                continue
            else:
                # Flush table
                # Filter out separator row e.g. |:---|:---|
                filtered_rows = []
                for tline in table_lines:
                    if re.match(r"^\|(\s*:?-+:?\s*\|)+$", tline):
                        continue
                    parts = [p.strip() for p in tline.split("|")[1:-1]]
                    filtered_rows.append(parts)
                    
                if filtered_rows:
                    num_cols = max(len(r) for r in filtered_rows)
                    tbl = doc.add_table(rows=len(filtered_rows), cols=num_cols)
                    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                    tbl.autofit = True
                    
                    for r_idx, row_data in enumerate(filtered_rows):
                        is_header = (r_idx == 0)
                        row = tbl.rows[r_idx]
                        for c_idx in range(num_cols):
                            cell = row.cells[c_idx]
                            val = row_data[c_idx] if c_idx < len(row_data) else ""
                            set_cell_margins(cell, 80, 80, 100, 100)
                            
                            p = cell.paragraphs[0]
                            p.paragraph_format.space_before = Pt(1)
                            p.paragraph_format.space_after = Pt(1)
                            
                            if is_header:
                                set_cell_background(cell, "1E293B")
                                run = p.add_run(val)
                                run.bold = True
                                run.font.size = Pt(9.0)
                                run.font.color.rgb = RGBColor(255, 255, 255)
                            else:
                                if r_idx % 2 == 1:
                                    set_cell_background(cell, "FFFFFF")
                                else:
                                    set_cell_background(cell, "F8FAFC")
                                run = p.add_run(val)
                                run.font.size = Pt(8.5)
                                run.font.color.rgb = RGBColor(30, 41, 59)
                                
                    p_sp = doc.add_paragraph()
                    p_sp.paragraph_format.space_after = Pt(4)
                    
                table_lines = []
                continue
                
        # Handle Headings
        if raw_strip.startswith("# "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(20)
            p.paragraph_format.space_after = Pt(6)
            run = p.add_run(raw_strip[2:])
            run.font.size = Pt(18)
            run.font.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42)
            i += 1
            continue
            
        if raw_strip.startswith("## "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run(raw_strip[3:])
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.color.rgb = RGBColor(79, 70, 229)
            i += 1
            continue
            
        if raw_strip.startswith("### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(10)
            p.paragraph_format.space_after = Pt(3)
            run = p.add_run(raw_strip[4:])
            run.font.size = Pt(11.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 41, 59)
            i += 1
            continue
            
        if raw_strip.startswith("#### "):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            run = p.add_run(raw_strip[5:])
            run.font.size = Pt(10.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(71, 85, 105)
            i += 1
            continue
            
        # Horizontal rule
        if raw_strip in ["---", "***"]:
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(6)
            p_border = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="6" w:space="1" w:color="E2E8F0"/></w:pBdr>')
            p._p.get_or_add_pPr().append(p_border)
            i += 1
            continue
            
        # Empty lines
        if not raw_strip:
            i += 1
            continue
            
        # Normal paragraph or list item
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        
        # Check if list item
        is_bullet = False
        text_content = raw_strip
        if text_content.startswith("- ") or text_content.startswith("* "):
            p.paragraph_format.left_indent = Inches(0.25)
            text_content = text_content[2:]
            is_bullet = True
            b_run = p.add_run("•  ")
            b_run.font.color.rgb = RGBColor(79, 70, 229)
            b_run.bold = True
        elif re.match(r"^\d+\.\s+", text_content):
            num_match = re.match(r"^(\d+\.)\s+", text_content)
            num_str = num_match.group(1)
            p.paragraph_format.left_indent = Inches(0.25)
            text_content = text_content[len(num_str):].strip()
            num_run = p.add_run(num_str + "  ")
            num_run.font.color.rgb = RGBColor(79, 70, 229)
            num_run.bold = True
            
        # Parse bold, italics, code inline
        parts = re.split(r"(\*\*.*?\*\*|`.*?`|\*.*?\*)", text_content)
        for part in parts:
            if not part:
                continue
            if part.startswith("**") and part.endswith("**") and len(part) >= 4:
                run = p.add_run(part[2:-2])
                run.bold = True
                run.font.color.rgb = RGBColor(15, 23, 42)
            elif part.startswith("`") and part.endswith("`") and len(part) >= 2:
                run = p.add_run(part[1:-1])
                run.font.name = "Consolas"
                run.font.size = Pt(9.0)
                run.font.color.rgb = RGBColor(79, 70, 229)
            elif part.startswith("*") and part.endswith("*") and len(part) >= 2:
                run = p.add_run(part[1:-1])
                run.italic = True
            else:
                run = p.add_run(part)
                run.font.color.rgb = RGBColor(30, 41, 59)
                
        i += 1

    doc.save(docx_path)
    print(f"Successfully generated DOCX: {docx_path}")

if __name__ == "__main__":
    build_docx()

