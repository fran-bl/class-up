"use client"

import { useEffect, useRef, useState } from "react"
import type { RenderTask, PDFDocumentProxy } from "pdfjs-dist"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink } from "lucide-react"

interface PDFPreviewProps {
  fileUrl: string
  fileName?: string
}

export default function PDFPreview({ fileUrl, fileName = "document.pdf" }: PDFPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const renderTaskRef = useRef<RenderTask | null>(null)
  const [scale, setScale] = useState<number>(1.5)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)

  const renderPage = async (pageNum: number, currentScale: number) => {
    if (!pdfDocument) return

    setLoading(true)

    try {
      const page = await pdfDocument.getPage(pageNum)
      const viewport = page.getViewport({ scale: currentScale })

      const canvas = canvasRef.current
      if (!canvas) return

      const canvasContext = canvas.getContext("2d")
      if (!canvasContext) return

      canvas.height = viewport.height
      canvas.width = viewport.width

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }

      const renderContext = {
        canvasContext,
        viewport,
      }

      const renderTask = page.render(renderContext)
      renderTaskRef.current = renderTask

      await renderTask.promise
      setLoading(false)
    } catch (error) {
        console.error("Render error:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        setLoading(true)
        const pdfJS = await import("pdfjs-dist")
        const workerSrc = window.location.origin + "/pdf.worker.min.mjs"

        pdfJS.GlobalWorkerOptions.workerSrc = workerSrc

        const loadingTask = pdfJS.getDocument(fileUrl)
        const pdf = await loadingTask.promise

        if (isCancelled) return

        setPdfDocument(pdf)
        setNumPages(pdf.numPages)

        await renderPage(currentPage, scale)
      } catch (error) {
        console.error("Error loading PDF:", error)
        setLoading(false)
      }
    })()

    return () => {
      isCancelled = true
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel()
      }
    }
  }, [fileUrl])

  useEffect(() => {
    if (pdfDocument) {
      renderPage(currentPage, scale)
    }
  }, [currentPage, scale, pdfDocument])

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3))
  }

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5))
  }

  const openInNewWindow = () => {
    window.open(fileUrl, "_blank")
  }

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="text-lg font-medium">{fileName}</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={zoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button variant="outline" size="icon" onClick={zoomIn} disabled={scale >= 3}>
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button variant="outline" size="icon" onClick={openInNewWindow}>
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">Open in new window</span>
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="flex justify-center p-4 bg-muted/20 overflow-auto">
          <div className={`relative ${loading ? "opacity-50" : ""}`}>
            <canvas ref={canvasRef} className="shadow-md" />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {numPages > 1 && (
          <div className="flex items-center justify-center p-4 border-t">
            <Button variant="outline" size="icon" onClick={goToPreviousPage} disabled={currentPage <= 1}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="mx-4">
              Page {currentPage} of {numPages}
            </span>
            <Button variant="outline" size="icon" onClick={goToNextPage} disabled={currentPage >= numPages}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
