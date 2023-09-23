export interface IItem {
  name: string;
  quantity: number;
  value: number;
}
export class Item implements IItem {
  constructor(
    public name: string,
    public quantity: number,
    public value: number
  ) {}
}
