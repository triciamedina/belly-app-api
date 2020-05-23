module.exports = {
    PORT: process.env.PORT || 8000,
    WS_PORT: process.env.WS_PORT || 9000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql:belly@localhost/belly',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret',
}