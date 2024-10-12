type ItemWithKey<T> = {
  [key: string]: T;
};

const array2Object = <T>(arr: T[], key: string): ItemWithKey<T> => {
  return arr.reduce((obj: ItemWithKey<T>, item: any) => {
    obj[item[key]] = item;
    return obj;
  }, {});
};

export default array2Object;