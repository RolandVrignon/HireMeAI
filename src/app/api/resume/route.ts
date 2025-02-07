import { NextResponse } from "next/server";
import path from "path";
import PDFParser from "pdf2json";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const resumeText = await extractTextFromPdf("resume.pdf");
    return NextResponse.json({ result: resumeText }, { status: 200 });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return NextResponse.json(
      { error: "Error extracting resume text" },
      { status: 500 }
    );
  }
}

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
