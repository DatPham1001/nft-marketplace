import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const NFTLandingPage = React.lazy(() => import("pages/NFTLandingPage"));
const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Router>
        <Routes>
          <Route path="/" element={<NFTLandingPage />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
