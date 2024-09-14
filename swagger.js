import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
    },
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "The unique identifier for a todo item",
            },
            title: {
              type: "string",
              description: "The title of the todo item",
            },
            description: {
              type: "string",
              description: "Detailed description of the todo",
            },
            completed: {
              type: "boolean",
              description: "Whether the todo is completed",
            },
          },
        },
      },
    },
  },
  apis: ["./pages/api/**/*.ts"], // API 경로
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
