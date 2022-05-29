import dbConnect from '../../../lib/dbConnect';
import Equipment from '../../../models/equipment';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        /* find all the data in our database */
        const equipment = await Equipment.find({});
        res.status(200).json({ success: true, data: equipment });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        /* create a new model in the database */
        const equipmentItem = await Equipment.create(req.body);
        res.status(201).json({ success: true, data: equipmentItem });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
