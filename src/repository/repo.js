
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
 * Get the user Detals
 * Object Must include:
 * name, userID, photoURL
 *
 * Return null if user is not logged in
 *
 * todo: implementation
 * */
export async function getUserDetails() {
    //fake wait for 1000ms
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        name: 'John Doe',
        userID: '123456789',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80'
    }
}

/*
* Sign in with username and password
* returns true if successful
* todo : implementation
* */
export async function signIn(userName, password) {
    console.log('Sign in with: ', userName, password);
    //wait for 1000ms
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
}

/*
* Sign up with username and password
* returns true if successful
* todo : implementation
* */
export async function signUp(userName, password) {
    console.log('Sign up with: ', userName, password);
    // promise fake wait
    await new Promise(resolve => setTimeout(resolve, 1000));

    return true;
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
* */
export async function getGroupDetails(groupID){
    // promise fake wait
    await new Promise(resolve => setTimeout(resolve, 1000));
    // returning fake group details
    return {
        name: 'CSCI Project CUHK',
        description: 'This is a group for CSCI Project CUHK',
        photoURL: '',
        id: groupID
    };
}

/*
* Logs user out of the app
* **/
export async function logout(){
    // promise fake wait
    await new Promise(resolve => setTimeout(resolve, 1000));
    // returning fake group details
    return true;
}


/**
 * Load All the groups the user is a member of
 * **/
export async function getJoinedGroups(){
    //promise fake wait
    await new Promise(resolve => setTimeout(resolve, 1000));
    //returning fake groups
    return [
        {
            name: 'CSCI Project CUHK',
            description: 'This is a group for CSCI Project CUHK',
            photoURL: '',
            id: '1'
        },
        {
            name: 'Group 2',
            description: 'Desc of group 2',
            photoURL: '',
            id: '2'
        },
        {
            name: 'Group 3',
            description: 'Desc of group 3',
            photoURL: '',
            id: '3'
        },
        {
            name: 'Group 4',
            description: 'Desc of group 4',
            photoURL: '',
            id: '4'
        },
        {
            name: 'CSCI Project CUHK',
            description: 'This is a group for CSCI Project CUHK',
            photoURL: '',
            id: '1'
        },
        {
            name: 'Group 2',
            description: 'Desc of group 2',
            photoURL: '',
            id: '2'
        },
        {
            name: 'Group 3',
            description: 'Desc of group 3',
            photoURL: '',
            id: '3'
        },
        {
            name: 'Group 4',
            description: 'Desc of group 4',
            photoURL: '',
            id: '4'
        }
        
    ];
}