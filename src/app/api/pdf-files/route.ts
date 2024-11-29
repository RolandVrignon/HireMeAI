import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const baseDir = path.join(process.cwd(), "public");
  const locales = ["en", "fr", "nl", "de", "es"];
  const files: Record<string, string | null> = {};

  locales.forEach((locale) => {
    const localeDir = path.join(baseDir, locale);
    if (fs.existsSync(localeDir)) {
      const pdfFiles = fs.readdirSync(localeDir).filter((file) => file.endsWith(".pdf"));
      files[locale] = pdfFiles.length === 1 ? `/${locale}/${pdfFiles[0]}` : null;
    } else {
      files[locale] = null;
    }
  });

  return NextResponse.json(files);
}
