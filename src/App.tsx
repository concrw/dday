import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Create from "@/pages/Create";
import Event from "@/pages/Event";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<Create />} />
      <Route path="/event/:id" element={<Event />} />
    </Routes>
  );
}
