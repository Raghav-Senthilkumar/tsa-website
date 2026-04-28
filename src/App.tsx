import { Route, Routes } from "react-router-dom";

import { GalleryTransitionProvider } from "@/components/transitions/GalleryTransitionProvider";
import GalleryPage from "@/pages/GalleryPage";
import HomePage from "@/pages/HomePage";

export default function App() {
  return (
    <GalleryTransitionProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </GalleryTransitionProvider>
  );
}
