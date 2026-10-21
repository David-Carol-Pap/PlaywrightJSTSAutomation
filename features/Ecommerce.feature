Feature: Ecommerce validations

  Scenario: Placing the Order
     Given a login to Ecommerce application with "daniel65@gmail.com" and "World_Cup_Pa#@$480"
     When Add "ZARA COAT 3" to Cart
     Then Verify "ZARA COAT 3" is displayed in the Cart
     When Enter valid details and Place the Order
     Then Verify order is present in the OrderHistory