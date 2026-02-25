const getRequiredEnv = (value: string | undefined, key: string) => {
  const resolved = value?.trim();
  if (!resolved) {
    throw new Error(`Missing ${key}.`);
  }
  return resolved;
};

export const uploadFileFromBrowser = async (file: File) => {
  const cloudName = getRequiredEnv(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
  );

  const uploadPreset = getRequiredEnv(
    process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET,
    "NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET"
  );

  const uploadFolder =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER?.trim();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (uploadFolder) {
    formData.append("folder", uploadFolder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || "Cloudinary upload failed."
    );
  }

  if (!payload?.secure_url) {
    throw new Error("Upload succeeded but no secure_url returned.");
  }

  return payload.secure_url as string;
};