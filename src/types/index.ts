interface IItem {
  market_hash_name: string;
  currency: string;
  suggested_price: number | null;
  item_page: string | null;
  market_page: string | null;
  min_price: number | null;
  max_price: number | null;
  mean_price: number | null;
  quantity: number | null;
  not_traidable_min_price: number | null,
  tradable_min_price: number | null,
  created_at: Date;
  updated_at: Date;
}

export {
  IItem
}