export default function userHandler(req, res) {
  const {
    query: { index, name },
    method,
  } = req

  switch (method) {
    case 'GET':
      // Get data from your database
      res.status(200).json({ index, name: `Class ${index}` })
      break
    case 'PUT':
      // Update or create data in your database
      res.status(200).json({ index, name: name || `Class ${index}` })
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
