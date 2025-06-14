// utils/logger.js
import process from 'node:process'
import winston from 'winston'
import path from 'path'
import fs from 'fs'

// Ensure `logs/` directory exists
const logDir = path.join(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Filter out `warn`, but allow `info` and `error` to display in terminal
const filterWarnings = winston.format((info) => {
  return info.level === 'warn' ? false : info // Filter out `warn
})

// Dynamically create Logger
const createLogger = (logFileName = 'application.log', overwrite = false) => {
  const fileTransport = new winston.transports.File({
    filename: `logs/${logFileName}`,
    options: overwrite ? { flags: 'w' } : undefined // If overwrite=true, overwrite log
  })

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`
      })
    ),
    transports: [
      fileTransport, // Write to specified log file
      new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(filterWarnings())
      }), // Terminal displays `INFO`, but filters out `WARN`
      new winston.transports.Console({ level: 'error' }) // `ERROR` still displays
    ]
  })
}

// Allow dynamic Logger creation
const getLogger = (logFileName, overwrite = false) => createLogger(logFileName, overwrite)

// Wrap `console.log()`
const console_log = (loggerInstance, ...args) => {
  const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ')
  loggerInstance.info(message)
}

// Wrap `console.warn()`, not displayed in terminal
const console_warn = (loggerInstance, ...args) => {
  const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ')
  loggerInstance.warn(message) // Only write to file, not display in terminal
}

// Wrap `console.error()`
const console_error = (loggerInstance, ...args) => {
  const message = args
    .map((arg) =>
      arg instanceof Error ? arg.stack || arg.message : typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    )
    .join(' ')
  loggerInstance.error(message)
}

export { getLogger, console_log, console_warn, console_error }
// dummy for CodeRabbit

// dummy for CodeRabbit
