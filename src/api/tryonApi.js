const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/tryon";

export const createTryon = async (customerPhotoPath, clothPhotoPath) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerPhotoPath, clothPhotoPath }),
  });

  if (!res.ok) throw new Error("Failed to create try-on");

  return res.json();
};

export const getTryonResult = async (tryonId) => {
  const res = await fetch(`${BASE_URL}/${tryonId}`);

  if (!res.ok) throw new Error("Failed to fetch result");

  return res.json();
};

export const getPresignedUrl = async (fileName) => {
  const res = await fetch(
    `http://localhost:3000/upload/presigned-url?fileName=${fileName}`
  );
  return res.json();
};

export const uploadToS3 = async (url, file) => {
  await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
};
