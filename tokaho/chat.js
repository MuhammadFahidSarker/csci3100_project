// // Library
// const functions = require('firebase-functions')
// const admin = require('firebase-admin')
// const cookieParser = require('cookie-parser')
// const { Firestore } = require('@google-cloud/firestore')
// const os = require('os')
// const firestore = new Firestore()
// const user_table = firestore.collection('users')
// const { v4: uuidv4 } = require('uuid')
// const {
//   getDownloadURL,
//   getStorage,
//   uploadBytesResumable,
//   ref,
// } = require('firebase-admin/storage')

// module.exports = {
//     sendMessage: async function sendMessage(req,res,next){
//         const token = req.headers.authorization || req.cookies['authorization']
//         try {
//             const verified = await admin.auth().verifyIdToken(token)
//             if (verified){
//                 req.header.uid = verified.uid
//                 res.header('uid', verified.uid)
//             }
//             const messagesRef = firestore.collection(`groups/${groupId}/messages`)

//             await messagesRef.set({
//                 text: formValue,
//                 createdAt: firebase.firestore.FieldValue.serverTimestamp(),
//                 uid,
//                 photoURL,
//                 attachedF: url,
//             })
//         }
//         catch(err){

//         }

//     }
// }
