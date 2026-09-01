import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function parseTextContent(text) {
  const cards = [];
  const lines = text.split('\n');

  let currentFront = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const defMatch = line.match(/^\d+\.?\s*Definition:\s*(.+)/i) || line.match(/^Definition:\s*(.+)/i);
    const ansMatch = line.match(/^\d+\.?\s*Answer:\s*(.+)/i) || line.match(/^Answer:\s*(.+)/i);

    if (defMatch) {
      currentFront = defMatch[1].trim();
    } else if (ansMatch && currentFront) {
      const back = ansMatch[1].trim();
      if (back) {
        cards.push({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
          front: currentFront,
          back: back,
        });
      }
      currentFront = null;
    }
  }

  return cards;
}

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'txt') {
    const text = await file.text();
    return parseTextContent(text);
  }

  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return parseTextContent(result.value);
  }

  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n';
    }

    return parseTextContent(text);
  }

  throw new Error('Unsupported file format. Use .txt, .docx, or .pdf');
}
