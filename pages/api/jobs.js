import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const jobsCollection = db.collection('jobs');

  if (req.method === 'GET') {
    try {
      const jobs = await jobsCollection.find({}).toArray();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const newJob = {
        title: req.body.title,
        company: req.body.company,
        jobUrl: req.body.jobUrl,
        source: req.body.source,
        appliedDate: new Date(),
        status: 'applied',
        notes: req.body.notes || '',
      };
      const result = await jobsCollection.insertOne(newJob);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
