# initialize the environment

1. npm install --save
2. run run.bat
3. open browser



## How to Call the APIs:



  for all APIs:
 
* the security token must be present in the "authorization" field in the HTTP request header (except /verify , which is to verify user's email address)
    
* the HTTP body must be encoded as x-www-form-urlencoded
    

## What you get:
  JSON response
  
  * if the API call successes, a "Succeed" field is present in the response JSON
  * if the API call fails, an "Error" field is present inthe response JSON
   
## examples:
* registration

Even if the user has created an account from the firebase, the registration is *NOT YET* finished

Developer need to invoke the API calls to /register, and present the security token from the firebase


Then the user shall recieve an email from his/her email account

User can  click on the link inside the email and recieve a success message

After that, the user is set to be verified in the database, and he/she is able to invoke subsequence API calls beyond the centralAUth now
