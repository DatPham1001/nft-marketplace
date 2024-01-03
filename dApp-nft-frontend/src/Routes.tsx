import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const NFTLandingPage = React.lazy(() => import("pages/NFTLandingPage"));
const NFTListOrder = React.lazy(() => import("pages/NFTListOrder"));
const ProjectRoutes = () => {
  return (
    <React.Suspense fallback={<>Loading...</>}>
      <Router>
        <Routes>
          <Route path="/" element={<NFTLandingPage />} />
					<Route path="/listOrder" element={<NFTListOrder />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};
export default ProjectRoutes;
