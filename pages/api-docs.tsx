import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(
  () => import("swagger-ui-react").then((mod) => mod.default),
  {
    ssr: false,
  }
) as any;

function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/swagger")
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return <div>로딩 중...</div>;
  }

  return <SwaggerUI spec={spec} />;
}

export default ApiDocs;
