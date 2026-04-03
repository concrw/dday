import { Routes, Route } from "react-router-dom";
import Create from "./pages/Create";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-slate-50">DDay</h1>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
    </Routes>
  );
}
