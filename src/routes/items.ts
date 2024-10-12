import express, { Request, Response } from 'express';
import getItems from '../shared/getItems';

const router = express.Router();

router.get('/items', async (req: Request, res: Response) => {
    try {
        const result = await getItems()

        res.json(result);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Error fetching items');
    }
});

export default router;
