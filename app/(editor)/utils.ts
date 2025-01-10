export const SLIDE_INTERVAL = 5000;
export const TRANSITION_DURATION = 500;

export const DEFAULT_SLIDE_STATE = {
  backgroundColor: "#E6D5C3",
  title: "",
  subtitle: "",
  cta: "",
};

export const handleFileUpload = async (
  formData: FormData,
  upload: (formData: FormData) => Promise<void>,
  setIsUploading: (value: boolean) => void,
  setNewSlide: (value: any) => void
) => {
  setIsUploading(true);
  try {
    await upload(formData);
    setNewSlide(DEFAULT_SLIDE_STATE);
  } catch (error) {
    console.error("Error uploading slide:", error);
  } finally {
    setIsUploading(false);
  }
};
