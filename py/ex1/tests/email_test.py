import pytest


class Email_Validator:
    def is_valid_email(self, email: str) -> bool:
        return True
    
class Email:
    def __init__(self, validator: Email_Validator):
        self.email_validator = validator
    

    def is_valid_email(self, email:str) -> bool:
        result = self.email_validator.is_valid_email(email)
        return result
        
        
before_all = None

def setup_module():
    global before_all
    before_all = "variável global"

def test_global_var():
    assert before_all == "variável global"

def test_invalid_global_var():
    assert before_all != "variavel_global"
        
@pytest.fixture        
def before_each()-> Email:
    email=  Email(Email_Validator())
    return email

def test_is_valid_email(before_each):
    email = before_each

    is_email = email.is_valid_email("rene@mail.com")

    assert(is_email) == True

def test_invalid_email(monkeypatch, before_each):
    email = before_each
    def mock_is_invalid_email(email):
        return False
    monkeypatch.setattr(email,"is_valid_email", mock_is_invalid_email)

    is_email = email.is_valid_email("invalid_email@mail.com")

    assert(is_email) == False