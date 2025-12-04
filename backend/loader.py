from pypdf import PdfReader

def extract_text(file_bytes: bytes, filename: str):
    if filename.endswith(".txt"):
        return file_bytes.decode(errors="ignore")
    elif filename.endswith(".pdf"):
        reader = PdfReader(file_bytes)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    else:
        raise ValueError("Unsupported file format")

def chunk_text(text, chunk_size=512):
    words = text.split()
    chunks = []
    current = []

    for word in words:
        current.append(word)
        if len(current) >= chunk_size:
            chunks.append(" ".join(current))
            current = []

    if current:
        chunks.append(" ".join(current))

    return chunks
