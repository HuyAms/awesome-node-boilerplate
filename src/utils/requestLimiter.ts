import rateLimit from 'express-rate-limit'
import config from '../config'

/**
 * Limit the amount of requests to a particular route
 *
 * @param time time period that the maximum amount of requests are set
 * @param max maximum amount of requests that can hit the API
 */
const {defaultTimeLimit, defaultAmountLimit} = config.requestLimiter

export const limitRequest = (
	time: number = defaultTimeLimit,
	max: number = defaultAmountLimit,
) => {
	return rateLimit({
		windowMs: time,
		max,
	})
}
