Feature: Ecommerce validations

@Error
  Scenario Outline: Placing the Order
     Given a login to Ecommerce2 application with "<username>" and "<password>"
     Then Verify error message is displayed

     Examples:
      | username               | password       |
      | invalid_user@gmail.com | wrong_password |
      | hello@123.com          | Iamhello@12    |