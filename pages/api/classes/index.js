import dbConnect from '../../../lib/dbConnect'
import Class from '../../../models/Class'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const classes = await Class.find({}) /* find all the data in our database */
        res.status(200).json({ success: true, data: classes })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const dndClass = await Class.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: dndClass })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}