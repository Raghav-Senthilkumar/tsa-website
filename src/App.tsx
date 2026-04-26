import { Route, Routes } from "react-router-dom";

import GalleryPage from "@/pages/GalleryPage";
import HomePage from "@/pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<GalleryPage />} />
    </Routes>
  );
}
