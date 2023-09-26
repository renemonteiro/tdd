import pytest
from .user_service import User_Service
import uuid
before_all_user = None

def setup_module():
    global before_all_user
    before_all_user = {"name": "René","email":"rene@mail.com"}
class User_Repository:
    def add(self, user):
        user["id"] = uuid.uuid4()
        return user
    def get_user_by_id(self, id):
        return  {
            "id":id,
            **before_all_user,
            }
    
@pytest.fixture        
def before_each():
    user_service = User_Service(User_Repository())
    return user_service


    
def test_create_an_user(before_each):
    user_service = before_each
    user = before_all_user
    result = user_service.add(user)

    assert(result) == user

def test_get_user_by_id(before_each):
    
    user_service = before_each
    id = uuid.uuid4()
    

    result = user_service.get_user_by_id(id)

    assert (result) == {"id":id, **before_all_user}


def test_get_user_by_id_fail(monkeypatch, before_each):
    def mock_fail(self, id):
        return {"message": "user not found"}
        

    user_service = before_each

    monkeypatch.setattr(User_Repository, "get_user_by_id", mock_fail)

    with pytest.raises(ValueError):
        user_service.get_user_by_id(uuid.uuid4())
    
