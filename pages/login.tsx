import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// window 객체를 사용하는 컴포넌트를 동적으로 임포트
const LoginComponent = dynamic(() => import("../components/LoginComponent"), {
  ssr: false,
});

function Login() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient && <LoginComponent />}</div>;
}

export default Login;
