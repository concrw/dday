import { Routes, Route } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { LandingPage } from '@/pages/LandingPage';
import { CreatePage } from '@/pages/CreatePage';
import { DetailPage } from '@/pages/DetailPage';
import { EditPage } from '@/pages/EditPage';

function App() {
  return (
    <div className="min-h-screen bg-bg">
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/events/:id" element={<DetailPage />} />
        <Route path="/events/:id/edit" element={<EditPage />} />
      </Routes>
    </div>
  );
}

export default App;
