import { Cart } from "./cart";
import { Item } from "./item";

const item = new Item("caneta", 5, 10);
const cart = new Cart();

cart.add(item);
console.log(cart.valueOfCart());
console.log(cart.getItems());
console.log(cart.getLengthItems());
