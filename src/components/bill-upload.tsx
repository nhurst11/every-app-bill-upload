"use client";

import { useState, useCallback } from "react";
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
    <div className="glass rounded-xl p-6">
      {status === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-all ${
            dragOver
              ? "border-accent-color bg-accent-color/5 shadow-[0_0_30px_rgba(255,102,0,0.1)]"
              : "border-border hover:border-accent-color/30"
          }`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-color/10 mb-4">
            <Upload className="h-7 w-7 text-accent-color" />
          </div>
          <p className="mb-2 text-lg font-medium">
            Drop your energy bill here
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            PDF, PNG, or JPG up to 10MB
          </p>
          <label className="cursor-pointer">
            <span className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-white/5 px-4 py-2 text-sm font-medium hover:border-accent-color/30 hover:text-accent-color transition-colors">
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
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-alt/10 mb-4">
            <FileText className="h-7 w-7 animate-pulse text-accent-alt" />
          </div>
          <p className="mb-2 text-lg font-medium">Analyzing your bill...</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Claude AI is extracting data from your bill
          </p>
          <Progress value={66} className="w-48" />
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-color/10 mb-4">
            <CheckCircle className="h-7 w-7 text-accent-color" />
          </div>
          <p className="text-lg font-medium text-accent-color text-glow-accent">
            Bill analyzed successfully!
          </p>
          <p className="text-sm text-muted-foreground">Refreshing...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 mb-4">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <p className="mb-2 text-lg font-medium text-red-400">
            Analysis failed
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            {errorMessage}
          </p>
          <Button
            variant="outline"
            className="border-border hover:border-accent-color/30 hover:text-accent-color"
            onClick={() => {
              setStatus("idle");
              setErrorMessage("");
            }}
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
