import '@/styles/globals.css'; 
import type { AppProps } from 'next/app';
import GlobalHead from '@/components/GlobalHead';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalHead />
      <Component {...pageProps} />
    </>
  );
}
