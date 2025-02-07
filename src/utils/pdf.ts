import path from "path";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

export function extractTextFromPdf(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {

    const filePath = path.join(process.cwd(), "public", fileName);

    const pdfParser = new (PDFParser as any)(null, 1);

    pdfParser.on("pdfParser_dataError", () => {
      resolve("No informations has been found.");
    });

    pdfParser.on("pdfParser_dataReady", () => {
      resolve((pdfParser as any).getRawTextContent())
    });

    pdfParser.loadPDF(filePath);
  });
}