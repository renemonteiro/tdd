from .user_repository import User_Repository
import pytest
import uuid


before_all_user = None

def setup_module():
    global before_all_user
    before_all_user = {"name": "René","email":"rene@mail.com"}
    
@pytest.fixture        
def before_each():
    user_repository = User_Repository()
    return user_repository


def test_create_an_user(before_each):
    user_repository = before_each
    user = before_all_user
    result = user_repository.add(user)

    assert(result) == user

def test_get_user_by_id(before_each):
    user_repository = before_each
    user = before_all_user
    
    user_repository.add(user)
    result = user_repository.get_user_by_id(user["id"])
    assert(result) == user
    
def test_get_user_by_id_fail(before_each):
    user_repository = before_each

    id = uuid.uuid4()
    
    result = user_repository.get_user_by_id(id)
    assert(result) == {"message": "user not found"}


    


