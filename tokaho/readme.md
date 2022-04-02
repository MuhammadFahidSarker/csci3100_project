# initialize the environment

1. npm install --save
2. run run.bat
3. send HTTP request

# how to get the security token

```js
<script src="https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.14.1/firebase-auth.js"></script>
const firebaseConfig = {
    apiKey: "AIzaSyCL8Rgg8SUgYm0ZFjteD_CbdQQhyFtYlxk",
    authDomain: "test-96f35.firebaseapp.com",
    databaseURL: "https://test-96f35-default-rtdb.firebaseio.com",
    projectId: "test-96f35",
    storageBucket: "test-96f35.appspot.com",
    messagingSenderId: "213750274831",
    appId: "1:213750274831:web:b6b463fe9dcad688adbc7a",
    measurementId: "G-N4K0F1HWBN"
  };
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    user.getIdToken().then(function(data) {
      console.log('user name:',user.displayName)
	  console.log('user uid:',user.uid)
	  console.log('token:',data) // <-- security token
	  console.log(user)
    });
  }
});
```


## How to Call the APIs:



  for all APIs:
 
* the security token must be present in the "authorization" field in the HTTP request header (except /verify , which is to verify user's email address)
    
* the HTTP body must be encoded as x-www-form-urlencoded
    

## What you get:
  JSON response
  
  * if the API call successes, a "Succeed" field is present in the response JSON
  * if the API call fails, an "Error" field is present inthe response JSON
   
## examples:

### /register
> Even if the user has created an account from the firebase, the registration is *NOT YET* finished 
> Developer need to invoke the API calls to /register, and present the security token from the firebase
> Then the user shall recieve an email from his/her email account
#### necessary params:
header: 
* authorization: [security token]

### /verify
> User can  click on the link inside the email and recieve a success message
> After that, the user is set to be verified in the database, and he/she is able to invoke subsequence API calls beyond the centralAUth now
#### necessary params:
None, just click on the url given in the email

---

### /apis/creategroup
> Allow every user to create a new group
> requirement: the groupname must be unique
#### necessary params:
header: 
>* authorization: [security token]

body (x-www-form-urlencoded):
>* groupname: name of group being created

### /apis/deletegroup
> Only allow Group admin / Global admin to delete a group
#### necessary params:
header: 
>* authorization: [security token]

body (x-www-form-urlencoded):
>* groupname: name of group being deleted

### /apis/updategroup
> Only allow Group admin / Global admin to update the group profile
> **This API is not designed to handle the messages inside each group, please refer to the chat APIs**
#### necessary params:
header: 
>* authorization: [security token]

body (x-www-form-urlencoded):
>* groupname: name of group being deleted
>* update: a JSON-like object to represent the update field and value
>> e.g. if you want to set the zoomlink of group unhappy to be z1 and z2 --> {"groupname":"unhappy","zoomLink":["z1","z2"]}


### /apis/querygroup
> Allow all user to get the group profile
> if the group is private, only admin / group member can invoke this API call
#### necessary params:
header: 
>* authorization: [security token]

body (x-www-form-urlencoded):
>* groupname: name of group being deleted
