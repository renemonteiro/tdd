from item import Item
class Cart:
    _list_of_cart = []
    
    def add(self, item: Item)-> str:
        if not isinstance(item, Item):
            raise ValueError("item not added")
        
        self._list_of_cart.append(item)
            
        return "item added"

    