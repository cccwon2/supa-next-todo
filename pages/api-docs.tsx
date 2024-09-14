import React from "react";
import SwaggerUI from "swagger-ui-react";

const ApiDocs: React.FC = () => {
  return <SwaggerUI url="/api/swagger" />;
};

export default ApiDocs;
