export const serverErrorResponse = (statusCode, message, error) => {
  return {
    statusCode,
    message,
    error: typeof error === 'string' ? error : JSON.stringify(error)
  }
}