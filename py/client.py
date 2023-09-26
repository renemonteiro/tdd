
import uuid
from ex2.repository.user_repository import User_Repository
from ex2.service.user_service import User_Service
from ex2.controller.user_controler import User_Controller


user_repository = User_Repository()
user_service = User_Service(user_repository)
user_controller = User_Controller(user_service)

user = user_controller.add({"name":"rene", "email":"rene@mail.com"})
print(user)
result = user_controller.get_user_by_id(user["id"])
print(result)