import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { ComponentType } from "react";
import { OpenAPIV3 } from "openapi-types";

const SwaggerUI: ComponentType<{ spec: OpenAPIV3.Document }> = dynamic(
  () =>
    import("swagger-ui-react") as Promise<{
      default: ComponentType<{ spec: OpenAPIV3.Document }>;
    }>,
  { ssr: false }
);

function ApiDocs() {
  const [spec, setSpec] = useState<OpenAPIV3.Document | null>(null);

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
