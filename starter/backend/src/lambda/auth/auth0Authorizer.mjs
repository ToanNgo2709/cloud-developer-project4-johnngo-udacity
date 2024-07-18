import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-mxx0m2e5w7pe67ru.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  logger.info('Todo: verify token')

  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // Implement token verification
  const responseData = await Axios.get(jwksUrl)
  const JwkKeys = responseData.data.keys
  const signingKey = JwkKeys.find(key => key.kid === jwt.header.kid)

  // Check singing key
  if (!signingKey) {
    logger.error('Todo: signing key is null')
    throw new Error('Error: signing key is not valid')
  }

  // create pem data 
  const pemData = signingKey.x5c[0]

  // create certificate from pem data
  const certificate = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`

  // verify token
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
