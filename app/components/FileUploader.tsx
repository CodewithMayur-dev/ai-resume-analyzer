import { useRef, useState } from "react";
import { cn } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function FileUploader({
  onFileSelect,
  selectedFile,
  onClear,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (selectedFile) {
    return (
      <div className="uploader-selected-file">
        <div className="flex items-center gap-3">
          <img src="/images/pdf.png" alt="PDF" className="w-8 h-8 object-contain" />
          <div>
            <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 cursor-pointer"
        >
          <img src="/icons/cross.svg" alt="Remove" className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "uplader-drag-area border-2 border-dashed",
        isDragging
          ? "border-blue-400 bg-blue-50"
          : "border-gray-200 hover:border-blue-300"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <img
          src="/images/pdf.png"
          alt="Upload PDF"
          className="w-12 h-12 object-contain opacity-70"
        />
        <p className="text-gray-600 font-medium">
          Drag & drop your resume here
        </p>
        <p className="text-sm text-gray-400">or click to browse</p>
        <p className="text-xs text-gray-400">PDF files only · Max 10MB</p>
      </div>
    </div>
  );
}
