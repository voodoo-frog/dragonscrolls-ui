import dbConnect from '../../../lib/dbConnect';
import Race from '../../../models/race';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        /* find all the data in our database */
        const races = await Race.find({});
        res.status(200).json({ success: true, data: races });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        /* create a new model in the database */
        const race = await Race.create(req.body);
        res.status(201).json({ success: true, data: race });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
