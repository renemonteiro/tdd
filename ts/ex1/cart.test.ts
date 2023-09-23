import { beforeEach, describe, expect, test } from "vitest";
import { Cart, ICart } from "./cart";
import { IItem, Item } from "./item";

let cart: ICart;
let item: IItem;
let dataBuilder: DataBuilder;

class DataBuilder {
  private mycart: ICart = new Cart();
  constructor() {}

  add(...numbers: number[]) {
    for (const number of numbers) {
      this.mycart.add({
        name: "item",
        value: 2,
        quantity: number,
      });
    }
    return this;
  }

  make() {
    return this.mycart;
  }
}
beforeEach(() => {
  cart = new Cart();
  item = new Item("papel", 1, 30);
  dataBuilder = new DataBuilder();
});

describe("cart", () => {
  test("Should not return items of cart", () => {
    const total = cart.getLengthItems();
    expect(total).toEqual(0);
  });

  test("should return one item from cart", () => {
    cart.add(item);
    const total = cart.getLengthItems();
    expect(total).toEqual(1);
  });

  test("should return the value of purchecase", () => {
    dataBuilder.add(10, 20, 50);
    const valueOfCart = dataBuilder.make().valueOfCart();
    expect(valueOfCart).toEqual(160);
  });

  test("should return the correct number of item added in the cart", () => {
    dataBuilder.add(15, 5, 10, 20);
    const totalOfItems = dataBuilder.make().getLengthItems();
    expect(totalOfItems).toEqual(4);
  });

  test("should verify the correct items in cart", () => {
    dataBuilder.add(15, 5, 10, 20, 35);
    const [firstItem, secondItem, thirdItem, fourthItem, fifthItem] =
      dataBuilder.make().getItems();
    expect(firstItem.quantity).toEqual(15);
    expect(secondItem.quantity).toEqual(5);
    expect(thirdItem.quantity).toEqual(10);
    expect(fourthItem.quantity).toEqual(20);
    expect(fifthItem.quantity).toEqual(35);
  });
});
