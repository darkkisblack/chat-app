// Центральный обработчик ошибок
module.exports = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err)
  }

  res.status(statusCode).json({
    success: false,
    message
  })
}


