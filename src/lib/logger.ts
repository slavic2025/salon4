// lib/logger.ts
import { deepMap } from '@/lib/deepMap' // Importăm deepMap

type LogData = Record<string, unknown>

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
}

const DEFAULT_LOG_LEVEL: LogLevel = LogLevel.DEBUG

const resolveMinLogLevel = (): number => {
  const envLevel = (process.env.NEX_PUBLIC_LOG_LEVEL || DEFAULT_LOG_LEVEL).toLowerCase() as LogLevel
  return LOG_LEVEL_VALUES[envLevel] ?? LOG_LEVEL_VALUES[DEFAULT_LOG_LEVEL]
}

const minLogLevel = resolveMinLogLevel()

type LoggerFn = (message: string, data?: LogData) => void

// Funcția de înlocuire pentru deepMap care va redacta date sensibile și va formata anumite tipuri
const loggerReplaceFn = ({ path, key, value }: { path: string; key: string; value: any }): any => {
  // Lista de chei sensibile care ar trebui redactate (case-insensitive)
  const sensitiveKeys = [
    'password',
    'token',
    'accessToken',
    'refreshToken',
    'secret',
    'apiKey',
    'creditCardNumber',
    'cvv',
    'ssn',
  ]

  // Lista de căi sensibile (ex: 'user.password', 'headers.authorization')
  const sensitivePaths = [
    'headers.authorization',
    'user.password',
    'req.headers.authorization',
    'body.password',
    'body.token',
  ]

  // Verifică dacă cheia sau calea este sensibilă și redactează valoarea
  if (typeof key === 'string' && sensitiveKeys.includes(key.toLowerCase())) {
    return '[REDACTED]'
  }
  if (typeof path === 'string' && sensitivePaths.includes(path.toLowerCase())) {
    return '[REDACTED]'
  }

  // Gestionează obiectele Error pentru a afișa mesajul și stack-ul într-un format mai lizibil
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
      // Poți adăuga și alte proprietăți ale erorii dacă sunt relevante, ex: code: (value as any).code
    }
  }

  // Convertește funcțiile în reprezentări string pentru logare
  if (typeof value === 'function') {
    return `[Function: ${value.name || 'anonymous'}]`
  }
  // Convertește simbolurile în reprezentări string
  if (typeof value === 'symbol') {
    return value.toString()
  }
  // Convertește Set-urile în Array-uri pentru o logare mai bună
  if (value instanceof Set) {
    return Array.from(value)
  }
  // Convertește Map-urile în obiecte plain pentru o logare mai bună
  if (value instanceof Map) {
    return Object.fromEntries(value)
  }

  // Pentru toate celelalte valori, returnează-le așa cum sunt
  return value
}

export type Logger = {
  debug: (message: string, data?: LogData) => void
  info: (message: string, data?: LogData) => void
  warn: (message: string, data?: LogData) => void
  error: (message: string, data?: LogData) => void
}

export const createLogger = (context: string) => {
  const shouldLog = (level: LogLevel): boolean => LOG_LEVEL_VALUES[level] >= minLogLevel

  const format = (level: LogLevel, message: string): string => `[${level.toUpperCase()}] [${context}] ${message}`

  const emit = (level: LogLevel, message: string, data?: LogData): void => {
    const formatted = format(level, message)
    let processedData = data // Inițial, folosește datele originale

    if (data) {
      try {
        // Procesează obiectul 'data' cu deepMap pentru a redacta și formata
        processedData = deepMap(data, loggerReplaceFn) as LogData
      } catch (e) {
        // În cazul în care deepMap întâmpină o eroare (ex: tipuri neașteptate),
        // loghează eroarea și continuă cu datele originale sau un obiect care indică problema.
        console.error(`[${level.toUpperCase()}] [${context}] Eroare la aplicarea deepMap pe datele logului:`, e, data)
        processedData = { ...data, _deepMapError: (e as Error).message || 'Eroare necunoscută deepMap' }
      }
    }

    // Determină ce se va loga: mesajul formatat și, dacă există, datele procesate
    const output = processedData ? [formatted, processedData] : [formatted]

    // Utilizează metodele console corespunzătoare nivelului de logare
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(...output)
        break
      case LogLevel.INFO:
        console.info(...output)
        break
      case LogLevel.WARN:
        console.warn(...output)
        break
      case LogLevel.ERROR:
        console.error(...output)
        break
    }
  }

  const log =
    (level: LogLevel): LoggerFn =>
    (message, data) => {
      if (shouldLog(level)) {
        emit(level, message, data)
      }
    }
  return {
    debug: log(LogLevel.DEBUG),
    info: log(LogLevel.INFO),
    warn: log(LogLevel.WARN),
    error: log(LogLevel.ERROR),
  }
}
