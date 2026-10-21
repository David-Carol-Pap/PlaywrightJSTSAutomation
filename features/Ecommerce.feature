Feature: Ecommerce validations

    @Regression
    Scenario: Placing the Order
        Given a login to Ecommerce application with "daniel65@gmail.com" and "World_Cup_Pa#@$480"
        When Add "ZARA COAT 4" to Cart
        Then Verify "ZARA COAT 3" is displayed in the Cart
        When Enter valid details and Place the Order
        Then Verify order is present in the OrderHistory

    @Validation
    Scenario Outline: Placing the Order
        Given a login to Ecommerce2 application with "<username>" and "<password>"
        Then Verify error message is displayed

        Examples:
            | username               | password       |
            | invalid_user@gmail.com | wrong_password |
            | hello@123.com          | Iamhello@12    |