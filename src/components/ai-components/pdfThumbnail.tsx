import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import { Languages, Language } from "@/types/types"

// Configure le worker PDF.js à partir du dossier public
GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";


export const PdfThumbnail = ({ language }: { language: Language }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfAvailable, setIsPdfAvailable] = useState<boolean>(true);
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null); // Pour suivre les tâches de rendu en cours


  const getFileSize = async (url: string) => {
    const headResponse = await fetch(url, { method: "HEAD" });
    const contentLength = headResponse.headers.get("content-length");
    if (contentLength) {
      setFileSize(parseInt(contentLength, 10));
    }
  }

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const size = sizeInBytes / Math.pow(1024, i);
    return `${size.toFixed(2)} ${sizes[i]}`;
  };


  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const response = await fetch("/api/pdf-files");
        const data = await response.json();
        setPdfUrl(data[language] || data.en || null);
      } catch (error) {
        console.error("Error fetching PDF URL:", error);
        setIsPdfAvailable(false);
      }
    };

    fetchPdfUrl();
  }, [language]);

  useEffect(() => {
    const checkAndGenerateThumbnail = async () => {
      try {

        if (!pdfUrl) return;

        const pdf = await getDocument(pdfUrl).promise;
        await getFileSize(pdfUrl);
        setPageCount(pdf.numPages);
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Si une tâche de rendu est déjà en cours, annulez-la
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // Lancer le rendu sur le canvas
        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        // Enregistrer la tâche de rendu en cours
        renderTaskRef.current = renderTask;

        try {
          // Attendez la fin du rendu avant de continuer
          await renderTask.promise;

          // Si le rendu est terminé avec succès, générez l'image miniature
          setThumbnailSrc(canvas.toDataURL("image/png"));
        } catch (error: any) {
          if (error.name === "RenderingCancelledException") {
            console.warn("Rendering cancelled:", error.message);
          } else {
            throw error; // Renvoyez d'autres erreurs pour le débogage
          }
        } finally {
          // Réinitialisez la tâche de rendu une fois terminée
          renderTaskRef.current = null;
        }
      } catch (error) {
        console.error("Error rendering PDF:", error);
        setIsPdfAvailable(false);
      }
    };

    checkAndGenerateThumbnail();

    // Nettoyage lors du démontage ou de la mise à jour
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel(); // Annulez toute tâche de rendu en cours
      }
    };
  }, [pdfUrl]);



  const handleOpenPdf = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank");
  };

  return (
    <div
      onClick={handleOpenPdf}
      className={!isPdfAvailable ? "hidden" : `mask cursor-pointer mt-4 border-4 border-gray-300 rounded-lg shadow-md max-w-sm hover:shadow-lg transition-shadow overflow-hidden`}
    >
      <div className="h-[150px] overflow-hidden">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={`Thumbnail of the ${Languages[language]} resume`}
            className="w-full object-cover"
          />
        ) : (
          <canvas ref={canvasRef} className="hidden" />
        )}
      </div>
      <div className="p-2 bg-gray-200 gap-2 flex flex-col">
        <div className="text-sm font-semibold text-gray-700">
          {pdfUrl ? pdfUrl.split('/').pop() : ``}
        </div>
        <div className="text-xs text-gray-500">
          {fileSize ? formatFileSize(fileSize) : "Unknown size"} • {pageCount || "-"} pages
        </div>
      </div>
    </div>
  );
};

export default PdfThumbnail;
