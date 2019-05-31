import request from 'supertest'
import {app} from '../../server'

export const apiRequest = request(app)
