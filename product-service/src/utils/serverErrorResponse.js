export const serverErrorResponse = (statusCode, message, error) => {
  return {
    statusCode,
    body: JSON.stringify({
      message,
      error
    })
  }
}