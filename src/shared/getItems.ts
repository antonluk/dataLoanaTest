import axios from 'axios';
import { array2Object } from '../utils';
import { IItem } from '../types';

const getItems = async () => {
  const [
      { data: notTraidable },
      { data: traidable }
  ] = await Promise.all([
      axios.get('https://api.skinport.com/v1/items'),
      axios.get('https://api.skinport.com/v1/items', { params: { tradable: true } })
  ]);

  const notTraidableObj = array2Object<IItem>(notTraidable, 'market_hash_name');
  const tradableObj = array2Object<IItem>(traidable, 'market_hash_name');

  return traidable.map((item: IItem) => {
      return {
          ...item,
          not_traidable_min_price: notTraidableObj[item.market_hash_name]?.min_price,
          tradable_min_price: tradableObj[item.market_hash_name]?.min_price
      };
  });
}

export default getItems;