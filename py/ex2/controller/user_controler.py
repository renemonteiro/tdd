from ..service.user_service import User_Service


class User_Controller:

    def __init__(self, service: User_Service) -> None:
        self.service = service

    def add(self, user):
        try:
            return self.service.add(user)
        except ValueError as error:
            return str(error)
    
    
    def get_user_by_id(self, id):
        try:
            return self.service.get_user_by_id(id)
        except ValueError as error:
            return str(error)