#!/usr/bin/env python3
"""
OCR Processor for Estate Document Analyzer

Processes scanned/image-based PDFs using Tesseract OCR.
Converts PDF pages to images, runs OCR, and outputs extracted text.

Usage:
    python ocr_processor.py <input_pdf> <output_text_file>
    python ocr_processor.py <input_pdf>  # Outputs to stdout

Requirements:
    - tesseract-ocr (apt install tesseract-ocr)
    - pdf2image (pip install pdf2image)
    - pytesseract (pip install pytesseract)
    - poppler-utils (apt install poppler-utils)
"""

import sys
import os
from pathlib import Path

try:
    from pdf2image import convert_from_path
    import pytesseract
    from PIL import Image
except ImportError as e:
    print(f"Missing dependency: {e}")
    print("Install with: pip install pdf2image pytesseract pillow --break-system-packages")
    sys.exit(1)


def check_tesseract_installed():
    """Verify Tesseract is installed and accessible."""
    import shutil
    if not shutil.which("tesseract"):
        print("Error: Tesseract OCR is not installed.")
        print("Install with: apt install tesseract-ocr")
        return False
    return True


def is_image_pdf(pdf_path: str) -> bool:
    """
    Detect if a PDF is image-based (scanned) vs text-based.
    Returns True if PDF appears to be image-based.
    """
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            total_text = ""
            for page in pdf.pages[:3]:  # Check first 3 pages
                text = page.extract_text() or ""
                total_text += text
            # If very little text extracted, likely image-based
            return len(total_text.strip()) < 100
    except:
        # If pdfplumber fails, assume image-based
        return True


def extract_text_with_ocr(pdf_path: str, dpi: int = 300) -> tuple[str, float]:
    """
    Extract text from PDF using Tesseract OCR.
    
    Args:
        pdf_path: Path to input PDF file
        dpi: Resolution for PDF to image conversion (higher = better quality, slower)
    
    Returns:
        Tuple of (extracted_text, confidence_score)
    """
    if not check_tesseract_installed():
        return "", 0.0
    
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}")
        return "", 0.0
    
    print(f"Converting PDF to images at {dpi} DPI...")
    try:
        images = convert_from_path(str(pdf_path), dpi=dpi)
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        print("Ensure poppler-utils is installed: apt install poppler-utils")
        return "", 0.0
    
    all_text = []
    confidence_scores = []
    
    for i, image in enumerate(images):
        print(f"Processing page {i + 1} of {len(images)}...")
        
        # Get OCR data with confidence scores
        ocr_data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
        
        # Extract text
        page_text = pytesseract.image_to_string(image)
        all_text.append(f"--- Page {i + 1} ---\n{page_text}")
        
        # Calculate confidence for this page
        confidences = [int(c) for c in ocr_data['conf'] if int(c) > 0]
        if confidences:
            page_confidence = sum(confidences) / len(confidences)
            confidence_scores.append(page_confidence)
    
    full_text = "\n\n".join(all_text)
    avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
    
    return full_text, avg_confidence


def process_pdf(input_path: str, output_path: str = None) -> dict:
    """
    Process a PDF file, detecting if OCR is needed.
    
    Args:
        input_path: Path to input PDF
        output_path: Optional path for output text file
    
    Returns:
        Dict with keys: text, confidence, ocr_used, message
    """
    result = {
        "text": "",
        "confidence": 100.0,
        "ocr_used": False,
        "message": ""
    }
    
    # First, try to detect if this is an image-based PDF
    if is_image_pdf(input_path):
        print("Detected image-based PDF. Running OCR...")
        result["ocr_used"] = True
        text, confidence = extract_text_with_ocr(input_path)
        result["text"] = text
        result["confidence"] = confidence
        
        if confidence < 70:
            result["message"] = (
                "OCR confidence is low ({:.1f}%). The document appears to be a scanned image "
                "with reduced text quality. Please verify extracted content for accuracy."
            ).format(confidence)
        else:
            result["message"] = f"OCR completed successfully with {confidence:.1f}% confidence."
    else:
        print("Detected text-based PDF. Extracting text directly...")
        try:
            import pdfplumber
            with pdfplumber.open(input_path) as pdf:
                pages_text = []
                for i, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    pages_text.append(f"--- Page {i + 1} ---\n{page_text}")
                result["text"] = "\n\n".join(pages_text)
                result["message"] = "Text extracted directly from PDF (no OCR needed)."
        except Exception as e:
            print(f"Direct extraction failed: {e}. Falling back to OCR...")
            result["ocr_used"] = True
            text, confidence = extract_text_with_ocr(input_path)
            result["text"] = text
            result["confidence"] = confidence
    
    # Write to output file if specified
    if output_path and result["text"]:
        Path(output_path).write_text(result["text"], encoding="utf-8")
        print(f"Output written to: {output_path}")
    
    return result


def main():
    if len(sys.argv) < 2:
        print("Usage: python ocr_processor.py <input_pdf> [output_text_file]")
        print("\nExamples:")
        print("  python ocr_processor.py scanned_will.pdf extracted_text.txt")
        print("  python ocr_processor.py trust_document.pdf  # Outputs to stdout")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    if not os.path.exists(input_pdf):
        print(f"Error: File not found: {input_pdf}")
        sys.exit(1)
    
    result = process_pdf(input_pdf, output_file)
    
    print(f"\n{result['message']}")
    
    if result["ocr_used"] and result["confidence"] < 70:
        print("\n⚠️  WARNING: Low OCR confidence. Manual review recommended.")
    
    if not output_file:
        print("\n" + "=" * 60)
        print("EXTRACTED TEXT:")
        print("=" * 60)
        print(result["text"])
    
    # Return non-zero if confidence is very low
    if result["ocr_used"] and result["confidence"] < 50:
        sys.exit(2)
    
    sys.exit(0)


if __name__ == "__main__":
    main()
