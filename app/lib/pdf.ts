/**
 * Extracts text content from a PDF file using PDF.js.
 * This runs on the client side only.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Dynamically import pdfjs to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");

  // Use the worker from the public folder
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const textParts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        if (typeof item === "object" && item !== null && "str" in item) {
          return (item as { str: string }).str;
        }
        return "";
      })
      .join(" ");
    textParts.push(pageText);
  }

  return textParts.join("\n\n");
}
