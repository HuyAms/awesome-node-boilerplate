import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import packageJson from '../../package.json'
import config from '../config'

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: packageJson.name,
		version: packageJson.version,
		description: packageJson.description,
	},
	servers: [
		{
			url: `http://localhost:${config.port}/`,
			description: 'development server',
		},
	],
	produces: ['application/json'],
	consumes: ['application/json'],
	host: process.env.HOST || 'localhost:3000',
	basePath: '/',
}

const options = {
	swaggerDefinition,
	// TODO: refactor all definitions to one folder
	apis: [
		'./src/resources/**/*.ts',
		'./src/utils/apiError.ts',
		'./src/middlewares/errorHandler.ts',
		'./src/*.yaml',
	],
}

const swaggerSpec = swaggerJSDoc(options)

/**
 * Middleware to setup swagger docs
 *
 */
const swagger = [swaggerUi.serve, swaggerUi.setup(swaggerSpec)]

export default swagger
