import uuid

import pytest

from .user_controler import User_Controller

before_all_user = None

def setup_module():
    global before_all_user
    before_all_user = {"name": "René","email":"rene@mail.com"}

@pytest.fixture        
def before_each():
    user_controller = User_Controller(User_Service())
    return user_controller

    
class User_Service:
    def add(self, user):
        user["id"] = uuid.uuid4()
        return user
    
    def get_user_by_id(self, id):

        return {
            "id": id,
           **before_all_user
        }


    


def test_create_an_user_called(mocker):
    user_service = User_Service()
    user_controller = User_Controller(user_service)

    spy = mocker.spy(user_service, "add")

    user = before_all_user

    user_controller.add(user)

    spy.assert_called_once_with(user)

def test_create_an_user(before_each):
    user_controller = before_each

    user = before_all_user

    result = user_controller.add(user)

    assert (result) == user

def test_get_user_by_id(before_each):
    user_controller = before_each

    user = before_all_user
    newUser = user_controller.add(user)


    result = user_controller.get_user_by_id(newUser["id"])
    assert (result) == user
    assert (result["name"]) == "René"
    assert (result["email"]) == "rene@mail.com"


def test_get_user_by_id_fail(monkeypatch, before_each):
    def mock_get_user_by_id(self, id):
        raise ValueError("user not found")
    
    
    user_controller = before_each

    monkeypatch.setattr(User_Service, "get_user_by_id", mock_get_user_by_id)

    result = user_controller.get_user_by_id(uuid.uuid4())
    assert result == "user not found"
