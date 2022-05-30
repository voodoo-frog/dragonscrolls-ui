import dbConnect from '../../../lib/dbConnect';
import RuleSection from '../../../models/rule_section';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        /* find all the data in our database */
        const rule_sections = await RuleSection.find({});
        res.status(200).json({ success: true, data: rule_sections });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
