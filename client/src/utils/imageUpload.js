export const checkImage = (file) => {
  let err = "";
  if (!file) return (err = "File does not exist.");

  if (file.size > 1024 * 1024)
    // 1mb
    err = "The largest image size is 1mb.";

  if (file.type !== "image/jpeg" && file.type !== "image/png")
    err = "Image format is incorrect.";

  return err;
};

export const imageUpload = async (images) => {
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();

    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }

    // Use the unsigned preset you create in Cloudinary dashboard
    formData.append("upload_preset", "profiles");
    formData.append("cloud_name", "dmptubk2f");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dmptubk2f/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log("Cloudinary response:", data); // Debug log

      if (data.error) {
        console.error("Cloudinary upload error:", data.error);
        throw new Error(data.error.message);
      }

      if (!data.public_id || !data.secure_url) {
        throw new Error("Invalid response from Cloudinary");
      }

      imgArr.push({ public_id: data.public_id, url: data.secure_url });
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
  return imgArr;
};
