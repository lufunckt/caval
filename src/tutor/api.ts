import { localRequest } from "../lib/local-client";
export const tutorApi = (path: string, body?: unknown) => localRequest("/api/tutor/" + path, body);
export async function compressPhoto(
  file: File | Blob,
  max = 600,
): Promise<string> {
  if (
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    file.size > 10 * 1024 * 1024
  )
    throw new Error("Escolha uma foto JPG, PNG ou WebP de até 10 MB.");
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Seu navegador não conseguiu preparar a imagem.");
    ctx.fillStyle = "#fff7ed";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL("image/jpeg", 0.8);
    if (result.length > 260000)
      throw new Error("A foto ficou muito grande. Tente uma imagem menor.");
    return result;
  } finally {
    bitmap.close();
  }
}
