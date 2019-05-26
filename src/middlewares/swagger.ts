import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import packageJson from '../../package.json'

/**
 * Config swagger jsdoc
 *
 */
const swaggerDefinition = {
	openapi: '3.0.1',
	info: {
		title: packageJson.name,
		version: packageJson.version,
		description: packageJson.description,
	},
	components: {
		securitySchemes: {
			jwt: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
	},
	security: [{jwt: [] as string[]}],
}

const options = {
	swaggerDefinition,
	apis: ['./src/resources/**/*.ts', './src/docs/*.yaml'],
}

const swaggerSpec = swaggerJSDoc(options)

/**
 * Middleware to setup swagger docs
 *
 */
const swagger = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)]

export default swagger
