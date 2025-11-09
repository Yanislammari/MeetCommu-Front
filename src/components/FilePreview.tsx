import React, { useState } from "react";
import { FileIcon, defaultStyles, type FileIconProps } from "react-file-icon";
import { FaTimes } from "react-icons/fa";

interface FilePreviewProps {
  file?: File;
  url?: string;
  isInputPreview?: boolean;
  onRemove?: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, url, isInputPreview, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const source: string = file ? URL.createObjectURL(file) : url!;
  const filename: string = file?.name || (url ? url.split("/").pop()?.replace(/^[0-9]+-/, "") : "unknown") || "unknown";
  const extension: string = filename.split(".").pop()?.toLowerCase() ?? "";
  const isImage: boolean = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
  const isVideo: boolean = ["mp4", "mov", "webm"].includes(extension);

  const fileIconStyle: Partial<FileIconProps> = defaultStyles[extension as keyof typeof defaultStyles] || {
    iconColor: "#9b8af7",
    paperColor: "#1e1e2f",
    labelColor: "#9b8af7",
    labelTextColor: "#fff",
  }

  const handleClick = () => {
    if (isInputPreview) {
      return;
    }

    if (isImage || isVideo) {
      setPreviewUrl(source);
    }

    else {
      window.open(source, "_blank");
    }
  }

  const handleClosePreview = () => {
    setPreviewUrl(null);
  }

  const handleMediaClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onRemove?.();
  }

  return (
    <React.Fragment>
      <div onClick={handleClick} className={`relative flex-shrink-0 transition-transform border border-white/10 rounded-lg shadow-sm cursor-pointer overflow-hidden ${ isImage ? "w-40 h-40" : isVideo ? "w-60 h-40" : "w-40 flex flex-col bg-[#26263d]" } ${!isInputPreview ? "hover:scale-[1.02]" : ""} ${ !isImage && !isVideo ? "hover:bg-[#2f2f47]" : "" }`}>
        {isImage ? (
          <img src={source} alt={filename} className="w-full h-full object-cover" />
        ) : isVideo ? (
          <video src={source} controls className="w-full h-full object-cover" />
        ) : (
          <React.Fragment>
            <div className="flex flex-col items-center justify-center flex-1 p-4">
              <div className="w-10 h-10">
                <FileIcon extension={extension} {...fileIconStyle} />
              </div>
            </div>
            <div className="bg-[#1e1e2f] border-t border-white/10 px-2 py-1 w-full text-center">
              <span className="block text-[12px] text-gray-300 truncate" title={filename}>{filename}</span>
            </div>
          </React.Fragment>
        )}
        {isInputPreview && (
          <button onClick={(e) => handleMediaClose(e)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black/80 cursor-pointer transition">
            <FaTimes className="text-xs" />
          </button>
        )}
      </div>
      {previewUrl && (
        <div onClick={handleClosePreview} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {isImage ? (
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-[90vh] rounded-xl shadow-lg animate-scaleIn" />
            ) : (
              <video src={previewUrl} controls autoPlay className="max-w-full max-h-[90vh] rounded-xl shadow-lg animate-scaleIn" />
            )}
            <button onClick={handleClosePreview} className="absolute top-2 right-3 text-white text-xl font-bold hover:text-gray-300 cursor-pointer transition">
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default FilePreview;
