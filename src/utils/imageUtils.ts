export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function fileToObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

export async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function downloadImage(
  dataUrlOrUrl: string,
  filename: string,
  format: "png" | "jpeg" | "webp" = "png"
): void {
  if (dataUrlOrUrl.startsWith("data:")) {
    const link = document.createElement("a");
    link.download = `${filename}.${format}`;
    link.href = dataUrlOrUrl;
    link.click();
    return;
  }

  fetch(dataUrlOrUrl, { mode: "cors" })
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    })
    .catch(() => {
      const link = document.createElement("a");
      link.href = dataUrlOrUrl;
      link.download = `${filename}.${format}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.click();
    });
}

export async function convertFormat(
  src: string,
  format: "png" | "jpeg" | "webp"
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(`image/${format}`));
    };
    img.src = src;
  });
}
