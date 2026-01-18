declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_HOST?: string
    REDIS_PORT?: string
    REDIS_PASSWORD?: string
    REDIS_TLS?: string
  }
}
