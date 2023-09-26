import pytest


class Item:
    def __init__(self, name:str, quantity:int, value:int):
        self._name = name
        self._quantity = quantity
        self._value = value


    def is_valid_item(self):
        if not isinstance(self._name, str) or not isinstance(self._quantity, int) or not isinstance(self._value, int):
            raise ValueError("invalid instance")
        return True

    def get_item(self):
        item = {
            "name": self._name,
            "quantity": self._quantity,
            "value": self._value
        }
        return item

def test_create_an_item():
    item = Item("papel", 4,10)
    result = { "name": "papel", "quantity": 4, "value": 10}

    i = item.get_item()
    
    assert i["name"] == result["name"]
    assert i["quantity"] == result["quantity"]
    assert i["value"] == result["value"]


def test_valid_item():
    item = Item("papel", "4","10")
    with pytest.raises(ValueError):
        item.is_valid_item()

    