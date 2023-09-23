import pytest
from item import Item

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

    