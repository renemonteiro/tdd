from item import Item
from cart import Cart

item = Item("papel", 5, 10)
cart = Cart()

def test_create_an_cart():

    result = cart.add(item)

    assert result == "item added"

def test_create_an_cart_throw_an_error():
    item = { "name": "papel", "quantity": 5, "value ": 10}

    try:
        cart.add(item)
    except ValueError as e:
        assert str(e) == "item not added"


    