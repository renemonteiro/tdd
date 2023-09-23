
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
