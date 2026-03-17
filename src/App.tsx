import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './lib/cart';
import LoadingScreen from './components/LoadingScreen';
import { getSettings } from './lib/api';

function BackgroundFx() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_20%_10%,rgba(214,178,94,0.18),rgba(0,0,0,0)_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_80%_70%,rgba(214,178,94,0.12),rgba(0,0,0,0)_60%)]" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22300%22%20height=%22300%22%3E%3Cfilter%20id=%22n%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.9%22%20numOctaves=%224%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22300%22%20height=%22300%22%20filter=%22url(%23n)%22%20opacity=%220.35%22/%3E%3C/svg%3E')]" />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  const brandName = useMemo(() => settings?.brand_name || 'Elevens', [settings]);
  const whatsappPhone = useMemo(() => settings?.whatsapp_phone || '919999999999', [settings]);

  const fetchSettings = async () => {
    try {
      const s = await getSettings();
      setSettings(s);
    } catch (err) {
      console.error('Fetch error:', err);
      setSettings({ brand_name: 'Elevens', whatsapp_phone: '919999999999' });
    } finally {
      // Let the loading screen feel premium
      window.setTimeout(() => setLoading(false), 650);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <BrowserRouter>
      <CartProvider>
        <BackgroundFx />
        <LoadingScreen show={loading} />

        <div className="min-h-dvh text-white selection:bg-[#d6b25e]/30 selection:text-white">
          <Navbar brand={brandName} />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <Routes>
              <Route path="/" element={<Home brandName={brandName} whatsappPhone={whatsappPhone} />} />
              <Route path="/menu" element={<Menu />} />
            </Routes>
          </motion.main>

          <CartDrawer brandName={brandName} whatsappPhone={whatsappPhone} />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
