import express, { Request, Response } from 'express';
import { createClient } from 'redis';
import pool from '../db';

const router = express.Router();
const redisClient = createClient();

redisClient.connect().catch(console.error);

redisClient.on('error', (err) => console.error('Redis Client Error', err));

router.post('/buy', async (req: Request, res: Response): Promise<void> => {
    const { userId, itemId } = req.body;

    try {
        const userResult = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);

        
        if (!userResult.rows.length) {
            res.status(404).send('User not found');
            return;
        }

        const userBalance = parseFloat(userResult.rows[0].balance);

        const itemResult = await pool.query('SELECT * FROM items WHERE id = $1', [itemId]);
        if (!itemResult.rows.length) {
            res.status(404).send('Item not found');
            return;
        }

        const item = itemResult.rows[0];
        
        const itemPrice = parseFloat(item.tradable_min_price);

        if (!itemPrice) {
            res.status(400).send('Item not have price');
            return;
        }
        
        if (userBalance < itemPrice) {
            res.status(400).send('Insufficient balance');
            return;
        }

        await pool.query('BEGIN');

        await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [itemPrice, userId]);

        await pool.query(
            'INSERT INTO purchases (user_id, item_id, purchase_price) VALUES ($1, $2, $3)',
            [userId, itemId, itemPrice]
        );

        await pool.query('COMMIT');

        await redisClient.set(`user_balance_${userId}`, (userBalance - itemPrice).toString());

        res.send('Purchase successful');
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Purchase error:', error);
        res.status(500).send('Error during purchase');
    }
});

export default router;
