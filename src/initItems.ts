import pool from './db';
import axios from 'axios';
import getItems from './shared/getItems';
import { IItem } from './types';

const initItems = async() => {
  try {
    const items = await getItems();

    const query = `
    INSERT INTO items (
        market_hash_name, 
        currency, 
        suggested_price, 
        item_page, 
        market_page, 
        min_price, 
        max_price, 
        mean_price, 
        quantity, 
        not_traidable_min_price,
        tradable_min_price,
        created_at, 
        updated_at
    ) VALUES ${items.map((item: IItem) => {
        return `(
            '${item.market_hash_name.replace(/'/g, "''")}', 
            '${item.currency.replace(/'/g, "''")}', 
            ${item.suggested_price}, 
            '${item.item_page?.replace(/'/g, "''")}', 
            '${item.market_page?.replace(/'/g, "''")}', 
            ${item.min_price}, 
            ${item.max_price}, 
            ${item.mean_price}, 
            ${item.quantity}, 
            ${item.not_traidable_min_price}, 
            ${item.tradable_min_price},
            '${item.created_at}', 
            '${item.updated_at}'
            )`;
        }).join(',')}
    `;
        
      await pool.query(query);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

initItems();