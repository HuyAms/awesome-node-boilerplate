import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import packageJson from '../../package.json'
import config from '../config'

/**
 * Config swagger jsdoc
 *
 */
const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: packageJson.name,
		version: packageJson.version,
		description: packageJson.description,
	},
	servers: [
		{
			url: `http://localhost:${config.port}`,
			description: 'development server',
		},
	],
	basePath: '/',
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
