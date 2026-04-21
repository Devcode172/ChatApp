const defaultClientUrl = 'http://localhost:5173'
const defaultServerUrl = `http://localhost:${process.env.PORT || 3000}`

export const isProduction = process.env.NODE_ENV === 'production'

const splitOrigins = (value) => {
  if (!value || typeof value !== 'string') return []
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const allowedOrigins = Array.from(
  new Set(
    [
      ...splitOrigins(process.env.CLIENT_URL),
      ...splitOrigins(process.env.CLIENT_URL_PREVIEW),
      ...splitOrigins(process.env.CLIENT_URL_LOCAL),
      defaultClientUrl,
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ].filter(Boolean)
  )
)

export const serverUrl = process.env.SERVER_URL || defaultServerUrl

const cookieExpiresInDays = Number(process.env.COOKIE_EXPIRES || 7)

export const getAuthCookieOptions = () => ({
  expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
})

export const getClearedAuthCookieOptions = () => ({
  expires: new Date(0),
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
})
