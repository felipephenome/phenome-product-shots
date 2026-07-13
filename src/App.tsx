import { Header } from "./components/layout/Header";
import { MainLayout } from "./components/layout/MainLayout";
import { FolderPanel } from "./components/folder/FolderPanel";
import { useState } from "react";

export default function App() {
  const [folderOpen, setFolderOpen] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <Header onFolderToggle={() => setFolderOpen((p) => !p)} />
      <MainLayout />
      <FolderPanel open={folderOpen} onClose={() => setFolderOpen(false)} />
    </div>
  );
}
