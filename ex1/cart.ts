import { IItem } from "./item";

export interface ICart {
  add(item: IItem): void;
  getLengthItems(): number;
  valueOfCart(): number;
  getItems(): IItem[];
}
export class Cart implements ICart {
  private items: IItem[] = [];

  add(item: IItem) {
    this.items.push(item);
  }
  getLengthItems() {
    return this.items.length;
  }

  getItems() {
    return this.items;
  }
  valueOfCart() {
    let total = 0;
    for (const item of this.items) {
      let price = item.quantity * item.value;
      total += price;
    }
    return total;
  }
}
