
from io import BytesIO
from pathlib import Path

from pypdf import PdfReader
from docx import Document


def extract_text(content: bytes, filename: str) -> str:
    """Extract text from an uploaded PDF or DOCX resume."""
    extension = Path(filename).suffix.lower()

    if extension == ".pdf":
        reader = PdfReader(BytesIO(content))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)

    elif extension == ".docx":
        document = Document(BytesIO(content))
        text = "\n".join(paragraph.text for paragraph in document.paragraphs)

    else:
        raise ValueError("Unsupported file format. Upload a PDF or DOCX resume.")

    if not text.strip():
        raise ValueError(
            "No readable text found. The PDF may be scanned or image-based."
        )

    return text.strip()
