import type { AppProps } from "next/app";
import "swagger-ui-react/swagger-ui.css"; // 글로벌 CSS 파일 import

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
