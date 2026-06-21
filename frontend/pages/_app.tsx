/**
 * App entry point
 */

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/Layout';
import { useWebSocket } from '@/hooks/useWebSocket';

function WebSocketProvider({ children }: { children: React.ReactNode }) {
  useWebSocket();
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WebSocketProvider>
  );
}
