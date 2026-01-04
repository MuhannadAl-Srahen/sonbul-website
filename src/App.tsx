import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/util/ScrollToTop';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Team = lazy(() => import('./pages/Team'));
const TeamMember = lazy(() => import('./pages/TeamMember'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-40 gap-8">
      {/* Logo */}
      <img src="/assets/logo/logo.png" alt="Abu Sonbul Transporters" className="h-12 w-auto object-contain" />
      {/* Animated progress bar */}
      <div className="w-44 h-1 bg-ink/8 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full page-loading-bar" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
          <Route path="about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
          <Route path="services" element={<Suspense fallback={<PageLoader />}><Services /></Suspense>} />
          <Route path="logistics" element={<Suspense fallback={<PageLoader />}><Logistics /></Suspense>} />
          <Route path="gallery" element={<Suspense fallback={<PageLoader />}><Gallery /></Suspense>} />
          <Route path="team" element={<Suspense fallback={<PageLoader />}><Team /></Suspense>} />
          <Route path="team/:slug" element={<Suspense fallback={<PageLoader />}><TeamMember /></Suspense>} />
          <Route path="contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </>
  );
}
