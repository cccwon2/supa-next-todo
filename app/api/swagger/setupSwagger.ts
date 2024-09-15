import swaggerJsdoc from "swagger-jsdoc";

interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    servers: Array<{
      url: string;
    }>;
  };
  apis: string[];
}

interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
  }>;
  paths: Record<string, unknown>;
  components?: Record<string, unknown>;
}

const options: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Supa Next Todo API",
      version: "1.0.0",
      description: "API documentation for Supa Next Todo project",
    },
    servers: [
      {
        url:
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./app/api/**/*.ts"],
};

export function setupSwagger(): SwaggerSpec {
  return swaggerJsdoc(options) as SwaggerSpec;
}
