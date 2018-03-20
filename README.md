# dalviroo

a [Sails](http://sailsjs.org) application
# faasos

To run the app clone the repo and install using npm install

and use 'sails lift' to run

As the routes are authenticated so for setting order and predicted number a user has to be created first.

User creation -

1.API POST request to '/register'
e.g -
{
 "email":"some@mail.com",
 "password":"randompassword"
}

User Login -

2. API POST request to '/login'
e.g -
{
 "username":"some@mail.com",
 "password":"randompassword"
}

This will give an token which has to bee used for excessing homepage, order place and setting predicted value API's

Using postman for excessing API's -

set cookie adding the host name then Jwt='token_value'

Or cookie can be set in the (Google chrome)browser -

opening developer tools console and setting-

document.cookie="Jwt=token_value"

3. API requests for adding predicted values

'POST /predicted' 
e.g-
{
 "name": "Paneer Tikka",
 "predicted": 1050
}

4. API requests for placing order

'POST /order'
{
 "name": "Paneer Tikka",
 "quantity": 1050
}
