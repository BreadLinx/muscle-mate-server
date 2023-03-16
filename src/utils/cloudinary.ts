import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  secure: true,
});

export async function handleUpload(file: string): Promise<UploadApiResponse> {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}
