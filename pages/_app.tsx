import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SocketProvider from "./Provider/SocketContext";
import AuthContextProvider from "./Provider/Auth_provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <SocketProvider>
        <Component {...pageProps} />
      </SocketProvider>
    </AuthContextProvider>
  );
}
