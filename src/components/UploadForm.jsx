import { useState, useRef } from "react";
import {
  createTryon,
  getPresignedUrl,
  uploadToS3,
} from "../api/tryonApi";
import { FiPlus } from "react-icons/fi";

const UploadForm = ({ setTryonId }) => {
  const [customerFile, setCustomerFile] = useState(null);
  const [clothFile, setClothFile] = useState(null);

  const [customerPreview, setCustomerPreview] = useState(null);
  const [clothPreview, setClothPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const customerInputRef = useRef(null);
  const clothInputRef = useRef(null);

  // -----------------------
  // Handle file selection
  // -----------------------
  const handleCustomerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCustomerFile(file);
    setCustomerPreview(URL.createObjectURL(file));
  };

  const handleClothChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setClothFile(file);
    setClothPreview(URL.createObjectURL(file));
  };

  // -----------------------
  // Submit
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerFile || !clothFile) {
      alert("Please upload both images");
      return;
    }

    setLoading(true);

    try {
      const customerPresigned = await getPresignedUrl(customerFile.name);
      const clothPresigned = await getPresignedUrl(clothFile.name);

      await uploadToS3(customerPresigned.url, customerFile);
      await uploadToS3(clothPresigned.url, clothFile);

      const res = await createTryon(
        customerPresigned.key,
        clothPresigned.key
      );

      setTryonId(res.tryonId);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Images</h2>

      <div className="upload-grid">
        {/* CUSTOMER */}
        <div
          className="upload-square"
          onClick={() => customerInputRef.current.click()}
        >
          {customerPreview ? (
            <img src={customerPreview} alt="Customer" />
          ) : (
            <div className="upload-placeholder">
              <FiPlus size={32} />
              <p>Your Photo</p>
            </div>
          )}

          <input
            ref={customerInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCustomerChange}
          />
        </div>

        {/* CLOTH */}
        <div
          className="upload-square"
          onClick={() => clothInputRef.current.click()}
        >
          {clothPreview ? (
            <img src={clothPreview} alt="Cloth" />
          ) : (
            <div className="upload-placeholder">
              <FiPlus size={32} />
              <p>Outfit</p>
            </div>
          )}

          <input
            ref={clothInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleClothChange}
          />
        </div>
      </div>

      {/* CENTERED BUTTON */}
      <div className="button-container">
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Try-On"}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;