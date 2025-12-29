import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const applicationsCollection = db.collection('applications');

  if (req.method === 'GET') {
    try {
      const applications = await applicationsCollection.find({}).toArray();
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const newApplication = {
        jobId: new ObjectId(req.body.jobId),
        jobTitle: req.body.jobTitle,
        company: req.body.company,
        appliedDate: new Date(req.body.appliedDate),
        status: req.body.status || 'pending',
        followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : null,
        notes: req.body.notes || '',
        createdAt: new Date(),
      };
      const result = await applicationsCollection.insertOne(newApplication);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const result = await applicationsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
