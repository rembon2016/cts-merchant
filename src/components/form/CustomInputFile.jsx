import { useRef, useState, useEffect } from "react";

/**
 * CustomInputFile
 * Props:
 * - name: input name
 * - accept: accepted mime types (string)
 * - multiple: boolean
 * - onChange: function(files) called with File | File[]
 * - maxSize: max file size in bytes (optional)
 * - placeholder: shown when empty
 * - className: extra wrapper classes
 * - initialPreview: url of initial preview image
 */
const humanFileSize = (size) => {
  if (!size && size !== 0) return "";
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(i ? 1 : 0) +
    [" B", " KB", " MB", " GB", " TB"][i]
  );
};

export default function CustomInputFile({
  name,
  accept = "image/*",
  multiple = false,
  onChange,
  maxSize,
  placeholder = "Klik atau drop file di sini",
  className = "",
  initialPreview = null,
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  // create previews for image files
  // useEffect(() => {
  //   if (initialPreview && files.length === 0) {
  //     setFiles([
  //       { preview: initialPreview, name: "preview", size: 0, isRemote: true },
  //     ]);
  //   }
  //   return () => {
  //     // revoke object URLs created below
  //     // files.forEach((f) => {
  //     //   if (f.preview && f.objectUrl) URL.revokeObjectURL(f.preview);
  //     // });

  //     for (fileData of files) {
  //       if (fileData.preview && fileData.objectUrl) {
  //         URL.revokeObjectURL(fileData.preview);
  //       }
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    // set initial preview only when initialPreview provided and no files selected yet
    if (initialPreview && files.length === 0) {
      setFiles([
        {
          preview: initialPreview,
          name: "preview",
          size: 0,
          isImage: true,
          isRemote: true,
          objectUrl: false,
        },
      ]);
    }
    // we intentionally only depend on initialPreview here to set initial preview once
    // cleanup for object URLs when files change or on unmount
    // use a separate effect for cleanup to avoid re-triggering initialPreview logic
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPreview]);

  useEffect(() => {
    return () => {
      // revoke object URLs created by createObjectURL
      for (const fileData of files) {
        if (fileData?.preview && fileData?.objectUrl) {
          URL.revokeObjectURL(fileData.preview);
        }
      }
    };
  }, [files]);

  const handleFiles = (fileList) => {
    let arr = Array.from(fileList || []);
    // optional size filter
    if (maxSize) {
      arr = arr.filter((f) => f.size <= maxSize);
    }

    const mapped = arr.map((f) => {
      const isImage = f.type.startsWith("image/");
      return {
        file: f,
        name: f.name,
        size: f.size,
        isImage,
        preview: isImage ? URL.createObjectURL(f) : null,
        objectUrl: isImage ? true : false,
      };
    });

    const next = multiple ? mapped : mapped.slice(0, 1);
    setFiles(next);
    if (onChange) {
      onChange(multiple ? next.map((m) => m.file) : next[0]?.file ?? null);
    }
  };

  const onInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const triggerFileDialog = () => {
    inputRef.current?.click();
  };

  const removeFile = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    // revoke object urls
    const removed = files[idx];
    if (removed?.preview && removed?.objectUrl)
      URL.revokeObjectURL(removed.preview);
    setFiles(next);
    if (onChange)
      onChange(multiple ? next.map((m) => m.file) : next[0]?.file ?? null);
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onInputChange}
      />

      <button
        tabIndex={0}
        onClick={triggerFileDialog}
        onKeyDown={(e) => e.key === "Enter" && triggerFileDialog()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative flex items-center justify-center p-4 rounded-xl transition-shadow border-2 
          ${
            dragActive
              ? "border-indigo-400 shadow-lg"
              : "border-dashed border-gray-300"
          } bg-gradient-to-br from-white to-gray-50
          hover:shadow-md cursor-pointer w-full`}
      >
        {/* Decorative corner gradient */}
        <div
          className="absolute -inset-px rounded-xl pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.04))",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 w-full">
          {files.length > 0 ? (
            <div
              className={`grid ${
                multiple ? "grid-cols-4" : "grid-cols-1"
              } gap-3`}
            >
              {files.map((f, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center bg-white rounded-lg p-2 shadow-sm"
                >
                  {f.isImage && f.preview ? (
                    <div className="w-28 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={f.preview}
                        alt={f.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-20 rounded-md flex items-center justify-center bg-gray-100 text-sm text-gray-600">
                      <div className="text-center px-2">
                        <div className="font-medium">{f.name}</div>
                        <div className="text-xs">{humanFileSize(f.size)}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between w-full mt-2">
                    <div className="text-xs text-gray-500 truncate max-w-[140px]">
                      {f.name}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-xs text-red-500 ml-2"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 16v-4a4 4 0 014-4h0a4 4 0 014 4v4m-6 4h6"
                />
              </svg>
              <div className="font-medium text-gray-700">{placeholder}</div>
              <div className="text-xs text-gray-400">
                {accept ? `Tipe file: ${accept}` : "Semua tipe file"}
              </div>
            </div>
          )}
        </div>
      </button>
      {/* helper */}
      {maxSize ? (
        <p className="mt-2 text-xs text-gray-400">
          Maks: {humanFileSize(maxSize)}
        </p>
      ) : null}
    </div>
  );
}
