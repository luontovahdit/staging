const validateCoordinates = c => {
  return (
    c.length === 2 &&
    c[0] >= -180 && c[0] <= 180 &&
    c[1] >= -90 && c[1] <= 90
  )
}

module.exports = { validateCoordinates }