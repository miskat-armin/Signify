import storage from "@/config/storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const UploadImage = async (
  imageUri: string | null,
  filepath: string
) => {
  if (!imageUri) return;
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = ref(storage, filepath);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  } catch (error) {
    console.log(error);
  }
};
