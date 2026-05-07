import { useState } from "react";
import UploadForm from "../components/UploadForm";
import ResultViewer from "../components/ResultViewer";

const Home = () => {
  const [tryonId, setTryonId] = useState("");

  return (
    <div className="container">
      <header className="header">
        <h1>✨ Try-On</h1>
        <p>Visualize outfits on yourself using AI</p>
      </header>

      <div className="card">
        <UploadForm setTryonId={setTryonId} />
      </div>

      {tryonId && (
        <div className="card">
          <ResultViewer tryonId={tryonId} />
        </div>
      )}
    </div>
  );
};

export default Home;