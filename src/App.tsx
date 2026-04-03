import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LOADING_TEXT } from './constants/text';

const Home = lazy(() => import('./pages/Home'));
const CreateEdit = lazy(() => import('./pages/CreateEdit'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <p className="text-[#94A3B8] text-sm">{LOADING_TEXT.page}</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new" element={<CreateEdit />} />
        <Route path="/edit/:id" element={<CreateEdit />} />
      </Routes>
    </Suspense>
  );
}
