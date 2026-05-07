import API from "./axios";

export const getMyProfile = async () => {
  const response = await API.get("/profile/me");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/profile/update", profileData);
  return response.data;
};

export const uploadResume = async (formData) => {
  const response = await API.post("/upload/resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const uploadFile = async (formData) => {
  const response = await API.post("/upload/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
