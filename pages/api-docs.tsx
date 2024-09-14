// pages/api-docs.tsx
import React from "react";
import dynamic from "next/dynamic";

// 서버 사이드 렌더링을 비활성화하고 동적으로 SwaggerUI를 로드합니다.
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

const ApiDocs: React.FC = () => {
  return <SwaggerUI url="/api/swagger" />;
};

export default ApiDocs;
