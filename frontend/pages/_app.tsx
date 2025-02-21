import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import '../styles/tailwind.css';
import '../styles/globals.css';

import Navbar from '@/components/navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnProtectedRoute from '@/components/UnProtectedRoute';

import { CarProvider } from '@/CarContext';
import { GarageProvider } from '@/GarageContext';
import { ReservationProvider } from '@/ReservationContext';
import { AuthProvider } from '@/AuthContext';
import { VehicleProvider } from '@/VehicleContext';


const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const isAuthPage = router.pathname.startsWith('/auth/');

  return (
    <>
      <AnimatePresence>
        <GarageProvider>
          <CarProvider>
            <VehicleProvider>
              <ReservationProvider>
                <AuthProvider>
                  <Toaster position="bottom-left" />
                  {isAuthPage ? (
                    <>
                      <UnProtectedRoute>
                        <Component {...pageProps} />
                      </UnProtectedRoute>
                    </>
                  ) : (
                    <>
                      <ProtectedRoute>
                        <Navbar />
                        <Component {...pageProps} />
                      </ProtectedRoute>
                    </>
                  )}
                </AuthProvider>
              </ReservationProvider>
            </VehicleProvider>
          </CarProvider>
        </GarageProvider>
      </AnimatePresence>
    </>
  );
};

export default App;

