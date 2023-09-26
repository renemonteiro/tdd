from ..repository.user_repository import User_Repository

class User_Service:

    def __init__(self, repository: User_Repository):
        self.repository = repository

        
    def add(self, user):
        return self.repository.add(user)

    def get_user_by_id(self, id):
        user = self.repository.get_user_by_id(id)

        if not "id" in user and not "name" in user and not "email" in  user:
            raise ValueError("user not found")
            
        return user