import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
    },
  },
  apis: ["./pages/api/**/*.ts"], // 이 경로는 실제 API 파일 경로와 맞춰주세요
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
