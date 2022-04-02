#initialize the environment

1. npm install --save
2. run run.bat
3. open browser



##How to Call the APIs:

  for all APIs guarded by the centralAuth:
    1. the security token must be present in the HTTP request header
    2. the HTTP body should be encoded as x-www-form-urlencoded

##What you get:
  a json respone
   if the API call is successful, a "Succeed" field is present in the response JSON
   if the API call fails, a "Error" field is present inthe response JSON
