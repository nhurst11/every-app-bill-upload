"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function BillUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFile = useCallback(async (file: File) => {
    setStatus("uploading");
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/bills/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("success");
      // Refresh after a moment so user sees the success state
      setTimeout(() => {
        onUploadComplete?.();
      }, 1500);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }, [onUploadComplete]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <Card>
      <CardContent className="p-6">
        {status === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="mb-2 text-lg font-medium">
              Drop your energy bill here
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              PDF, PNG, or JPG up to 10MB
            </p>
            <label className="cursor-pointer">
              <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground">
                Browse files
              </span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        )}

        {status === "uploading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="mb-4 h-10 w-10 animate-pulse text-primary" />
            <p className="mb-2 text-lg font-medium">Analyzing your bill...</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Claude AI is extracting data from your bill
            </p>
            <Progress value={66} className="w-48" />
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="mb-4 h-10 w-10 text-green-600" />
            <p className="text-lg font-medium text-green-600">
              Bill analyzed successfully!
            </p>
            <p className="text-sm text-muted-foreground">Refreshing...</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="mb-4 h-10 w-10 text-red-600" />
            <p className="mb-2 text-lg font-medium text-red-600">
              Analysis failed
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              {errorMessage}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setStatus("idle");
                setErrorMessage("");
              }}
            >
              Try again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
