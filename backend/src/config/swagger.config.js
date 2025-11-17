import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Ynov Express API',
    version: '3.0.0',
    description: 'Documentation interactive de l’API Ynov Express avec authentification JWT, RBAC et ressources posts.',
    contact: {
      name: 'Équipe Ynov Express',
      url: 'https://github.com/stikwebservices/ynov-express'
    }
  },
  servers: [
    {
      url: `${process.env.API_URL || 'http://localhost:3000'}`,
      description: 'Serveur principal'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  }
}

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/features/**/*.routes.js',
    './src/docs/**/*.js'
  ]
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec


