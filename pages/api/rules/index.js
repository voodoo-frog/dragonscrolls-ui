import dbConnect from '../../../lib/dbConnect';
import Rule from '../../../models/rule';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        /* find all the data in our database */
        const rules = await Rule.find({});
        res.status(200).json({ success: true, data: rules });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
