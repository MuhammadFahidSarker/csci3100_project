import {getAuth, sendEmailVerification, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth,user} from "./firebase_auth";
//backend server url
const baseURL='http://localhost:8080'



/*
* Check if user is logged in
* returns true is user is logged in, false otherwise
* todo : implementation
*  @deprecated Use the getUserDetails to check information
*
* */
export async function isUserLoggedIn() {
    return true;
}

/*
 * Get the  user Detals
 * Object Must include:
 * name, userID, photoURL
 *
 * Return null if user is not logged in
 *
 * overload: implementation
 *  if userID is null => query current logined user
 *  else => query userID
 * */
export async function getUserDetails(userID=null) {
    try{
        let token = await user.getIdToken()
        let res = await fetch(baseURL+'/queryuser', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin        
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': token
            },
            // current userID => user.uid
            body: new URLSearchParams({userid:userID||user.uid}) 
          })
        let resBody= await res.json()
    
        return {
            success: true,
            isVerified: resBody.isVerified, //whether the user being queried is verified
            name: resBody.Content.name,
            userID: userID||user.uid,
            isAdmin: resBody.Content.role == 'admin',
            photoURL: resBody.Content.profile_icon||'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80'
        }
    }catch(e){
        return {success:false,error:e}
    }
}

/**
 * helper function to signUp
 * create a user profile at the database
 * @returns success, (response or error)
 *  
 */
async function createUser() {
    console.log('userid:',await user.getIdToken())
    let token = await user.getIdToken()
    let res = await fetch(baseURL+'/register', {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin        
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        // empty body
        body: JSON.stringify({}) 
      })
    //DEBUG
    console.log('createUser()',res.json())
    if(res.status != 300){
        //error in backend side
        return {success:false,error:res.json()}
    }
    return {success:true,response:res.json()}
}

/*
* send verification to current user
* return true if success
*/
export async function sendVerificationEmail(){
    if(user==null)
        return {success:false,error:'user==null'}
    try{
        let res = await sendEmailVerification(user)
        return {success:true,response:res}
    }catch(e){
        return {success:false,error:e}
    }
}

/*
* Sign in with username and password
* returns true if successful
*
* */
export async function signIn(userName, password) {
    console.log('Sign in with: ', userName, password);
    try{
        let userCredential = await signInWithEmailAndPassword(auth, userName, password);
        if(userCredential){
            console.log({logined:userCredential})
            return {success:true,userCredential:userCredential}
        }else{
            return {success:false,error:'unknown error'}
        }
    }catch(error){
        console.log({errorCode:error.code, errorMessage:error.message})
        return {success:false,error:error.code}
    }
}

/*
* Sign up with username and password
* returns true if successful
* 
* */
export async function signUp(userName, password) {
    console.log('Sign up with: ', userName, password);
    try{
        let userCredential = await createUserWithEmailAndPassword(auth, userName, password)
        if(userCredential){
            //registered
            console.log({registered:userCredential})
            //send verification email
            let sent = await sendVerificationEmail()
            if(sent.success==false){
                console.log('fail to send verification email',sent.error)
                return {success:false,error:'fail to send verification email'}
            }else{
                let create = await createUser()
                if(create.success==false){
                    console.log('failed to create user profile')
                    return {success:false,error:'fail to create user profile'}
                }else{
                    return {success:true,userCredential:userCredential}
                }
            }            
        }else{
            return {success:false,error:'unknown error'}
        }
    }catch(error){
        console.log({errorCode:error.code, errorMessage:error.message})
        return {success:false,error:error.code}
    }
}

/*
* Returns the google doc link as a string
* **/
export async function getGoogleDocLink(groupID) {
    //fake wait for 1000ms
    await new Promise(resolve => setTimeout(resolve, 1000));
    //dummy google doc link
    return 'https://docs.google.com/document/d/1OFISOmBrpAjoT4mt1wozwxy1XXoXRuwXne33s06SE1k/edit?usp=sharing';
}

/*
* returns google drive link as a string
* **/
export async function getGoogleDriveLink(groupID) {
    return 'https://drive.google.com/drive/folders/1iLYilbLLKIbYKOR3xvhRuOTj3m_gfP75';
}

/**
 * Returns google sheet link as a string
 * **/

export async function getGoogleSheetLink(groupID) {
    return 'https://docs.google.com/spreadsheets/d/1qZ_ejiZnkZyUATXvau2xPVkCkmJC0uectTemLU-bx0o/edit?usp=sharing';
}

/*
* Sends a new Message to the server
*
* Note object contains params provided in the getUserDetails function
*
* todo: implementation
* **/
export async function sendMessage(message, groupID, user) {
    console.log('sendMessage: ', message, groupID, user);
    // promise fake wait
    await new Promise(resolve => setTimeout(resolve, 1000));
}

export async function getJoinAbleZoomMeetingLink(groupID) {
    return 'https://zoom.us/j/908724981';
}

/**
 * get Group Chats
 * each message must contain name, text, timeStamp, and photoURL
 */
export async function getGroupChats(groupID) {
    // here are some 30 fake messages with some random google images as profileurl
    return [
        {
            name: 'John Doe',
            text: 'Hello, how are you?',
            timeStamp: '1:00',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'I am fine, thank you!',
            timeStamp: '1:01',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'How are you?',
            timeStamp: '1:02',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'I am fine, thank you!',
            timeStamp: '1:03',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'How are you?',
            timeStamp: '1:04',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'I am fine, thank you!',
            timeStamp: '1:05',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        // 20 more
        {
            name: 'John Doe',
            text: 'How are you?',
            timeStamp: '1:06',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'I am fine, thank you!',
            timeStamp: '1:07',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'How are you?',
            timeStamp: '1:08',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'I am fine, thank you!',
            timeStamp: '1:09',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'How are you?',
            timeStamp: '1:10',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
        {
            name: 'John Doe',
            text: 'I am fine, thank you!',
            timeStamp: '1:11',
            photoURL: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50'
        },
    ];
}


/*
* Returns the group details:
* Must contain name, description, photoURL
* if you want to get the group content by groupname, just change it inside the body
* e.g. body: new URLSearchParams({groupname:groupName}) 
* */
export async function getGroupDetails(groupID){
    //this is just a dummy photo
    let dummyIcon='https://cdn.pixabay.com/photo/2017/11/10/05/46/group-2935521_960_720.png'
    try{    
        let token = await user.getIdToken()
        let res = await fetch(baseURL+'/apis/querygroup', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin        
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': token
            },
            body: new URLSearchParams({groupid:groupID}) 
        });
        let resBody=res.json()
        if(res.status == 401){
            //not a global admin OR not a member in the private group
            return {success:false,error:resBody,unauthorized:true}
        }
        return {success:true, 
            content:{
            name: resBody.Succeed.Content.name,
            description: resBody.Succeed.Content.description,
            photoURL: resBody.Succeed.Content.group_icon||dummyIcon,
            id: groupID
        }};
    }catch(e){
        return {success:false,error:e}
    }

}

/*
* Logs user out of the app
* **/
export async function logout(){
    try{
        let signout = await signOut(auth);
        return {success:true,response:'logout'}
    }catch(error){
        console.log({errorCode:error.code, errorMessage:error.message})
        return {success:false,error:error.code}
    }
}


/**
 * Load All the groups the user is a member of
 * 
 * if userID is null => query current logined user
 *  else => query userID
 * 
 * implementation: 1. get user's groups --> get group's content
 * **/
export async function getJoinedGroups(userID=null){

    //get user's groups
    try{
        let token = await user.getIdToken()
        let res = await fetch(baseURL+'/apis/queryusergroup', {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin        
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token
            },
            // current userID => user.uid
            body: new URLSearchParams({userid:userID||user.uid}) 
        })
        let resBody=await res.json()
        let groups = resBody.Content

        let groupContent=[]
        for(let i=0; i<groups.length; i++){
            groupContent.push({
                name: groups[i].name,
                description: groups[i].description,
                photoURL: groups[i].group_icon || '',
                id: groups[i].groupid
            })
        }
        return {success:true,response:groupContent};
    }catch(e){
        return {success:false,error:e}
    }
    
}