import uuid
class User_Repository:
    _list = []

    def add(self, user):
        user["id"] = str(uuid.uuid4())
        self._list.append(user)
        return user
    
    
    def get_user_by_id(self, id):
        for user in self._list:
            if user["id"] == id:
                return user
        return {"message": "user not found"}
