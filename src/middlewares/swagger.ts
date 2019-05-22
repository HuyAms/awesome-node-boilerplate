import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import packageJson from '../../package.json'

const swaggerDefinition = {
	info: {
		title: packageJson.name,
		version: packageJson.version,
		description: packageJson.description,
	},
	produces: ['application/json'],
	consumes: ['application/json'],
	host: process.env.HOST || 'localhost:3000',
	basePath: '/',
}

const options = {
	swaggerDefinition,
	apis: ['./src/resources/**/*.ts', './src/utils/apiError.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

/**
 * Middleware to setup swagger docs
 *
 */
const swagger = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)]

export default swagger
