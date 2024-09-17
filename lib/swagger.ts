import { createSwaggerSpec } from "next-swagger-doc";

const apiDocumentation = createSwaggerSpec({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API 문서",
      version: "1.0",
    },
  },
});

export default apiDocumentation;
