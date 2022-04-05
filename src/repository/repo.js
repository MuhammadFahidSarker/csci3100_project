/*
* Check if user is logged in
* returns true is user is logged in, false otherwise
* todo : implementation
* */
export async function isUserLoggedIn() {
    return true;
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
export async function getGoogleDocLink() {
    //dummy google doc link
    return 'https://docs.google.com/document/d/1OFISOmBrpAjoT4mt1wozwxy1XXoXRuwXne33s06SE1k/edit?usp=sharing';
}

/*
* returns google drive link as a string
* **/
export async function getGoogleDriveLink(){
    return 'https://drive.google.com/drive/folders/1iLYilbLLKIbYKOR3xvhRuOTj3m_gfP75?usp=sharing';
}

/**
 * Returns google sheet link as a string
 * **/

 export async function getGoogleSheetLink(){
     return 'https://docs.google.com/spreadsheets/d/1qZ_ejiZnkZyUATXvau2xPVkCkmJC0uectTemLU-bx0o/edit?usp=sharing';
 }



 export async function getJoinAbleZoomMeetingLink(){
     return 'https://zoom.us/j/908724981';
 }

/**
 * get Group Chats
 */

export async function getGroupChats() {
    //30 fake chats
    // each chat contains a name (Person name), a time stamp and a text (all in string)

    //fake wait for 1000ms
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        {
            name: 'Person 1',
            timeStamp: '12:00',
            text: 'Hello, how are you?'
        },
        {
            name: 'Person 2',
            timeStamp: '12:01',
            text: 'I am fine, thank you!'
        },
        {
            name: 'Person 3',
            timeStamp: '12:02',
            text: 'How are you?'
        },
        {
            name: 'Person 4',
            timeStamp: '12:03',
            text: 'I am fine, thank you!'
        },
        {
            name: 'Person 5',
            timeStamp: '12:04',
            text: 'How are you?'
        },
        {
            name: 'Person 6',
            timeStamp: '12:05',
            text: 'I am fine, thank you!'
        },
        {
            name: 'Person 7',
            timeStamp: '12:06',
            text: 'How are you?'
        },
        {
            name: 'Person 8',
            timeStamp: '12:07',
            text: 'I am fine, thank you!'
        },
        {
            name: 'Person 9',
            timeStamp: '12:08',
            text: 'How are you?'
        },
        {
            name: 'Person 10',
            timeStamp: '12:09',
            text: 'I am fine, thank you!'
        },
        {
            name: 'Person 11',
            timeStamp: '12:10',
            text: 'How are you?'
        },
        {
            name: 'Person 12',
            timeStamp: '12:11',
            text: 'I am fine, thank you!'
        },
        {
            name: 'Person 13',
            timeStamp: '12:12',
            text: 'How are you?'
        },
        {
            name: 'Person 14',
            timeStamp: '12:13',
            text: 'I am fine, thank you!'
        },

    ];
}