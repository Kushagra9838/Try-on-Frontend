import { useEffect, useState } from "react";
import { getTryonResult } from "../api/tryonApi";

const ResultViewer = ({ tryonId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!tryonId) return;

    const interval = setInterval(async () => {
      try {
        const res = await getTryonResult(tryonId);
        setData(res);

        if (res.status === "completed" || res.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [tryonId]);

  if (!tryonId) return null;

  return (
    <div>
      <h2>Status: {data?.status}</h2>

      {data?.status === "completed" && (
        <img
          src={data.resultPhotoPath}
          alt="Result"
          style={{ width: "300px" }}
        />
      )}

      {data?.status === "failed" && <p>Something went wrong</p>}
    </div>
  );
};

export default ResultViewer;