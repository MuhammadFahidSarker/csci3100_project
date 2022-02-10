'use strict'


// credential
const serviceAccount = {
  "type": "service_account",
  "project_id": "test-96f35",
  "private_key_id": "d80466738d96767bfcef7ad27d6b21b0cb1fa82b",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDX0WO6nLx9gfFv\nEBOEIlTtgypW/tffIVM8WkgLbP6zKdNo2xjAtx4uPFhIo40ndbp9HYa4vIGvMLxy\nWcBqPQ9I/xkE7tr8quyu3bZargQG//QXIA7VZrI/aZqPsm8gmwGsJQ2Wt82036DG\nZ791LJ/zylSybaNF4lYtMHLmcH0y+zdSYl4dpG2GbR62sEgzu0+JuTxfLHY/L2HE\nPl2WntpBFnxK2ZOuhBkIWkRplXSBjj1HvncdNqTTfO1V1OtGJgzRvzqRlJpCnkPo\nsBnh0JH4bUfzB4JCUa207ZMLQ/oo2Xb4I9PV8VylcgWJ7HlstjwdvRCyevuV9XEp\nm69knLp5AgMBAAECggEAD0HPMCqzRu0oMrmQePjOB7d23Le/Q5fbxkpnSaApi7lz\nJ7hw0h5FR4VTxBjZ2lZf5MdGVlTZ7IHAb2tpvKj3OxTGVvCwMbNqBZJeI/V63+gk\nKvwEyHCDkpOQ426SHXGP3J9cS/wk/PqKkhQqDGrR86kUCUQnyiw40DuFV/ClDTTk\n1e/qrewBq6XG8yZI7ukl+Kr+E3s8ZwPr85903NAz9nYBfDIxgRBL75cOQ/injmmV\nuC8LJ3eJ8T6pntVFtDVhfURHplkgPiR37ikQ58AZQrqTFR1qp7ZdFKQJdlWeSh3D\nRfGKj/ugdwpmKxJyQz/VOC0/k9QprP5aB0FqnCVY7QKBgQD5xekEFkzENU88syNo\ndWtyafWx3uMWwMl/ij9AtMJSePXvjrafRxfiMsaexFmTzGHiNAR9JlgZlx+FdlZ8\nlc1YBM2+a+JmmD9wA//Ed9+D7OrEHu5Ew4GX5LTPxCJRUF8cFEnx6pwqTDZd1jtW\nuGBPtizQO7zqrKiUhHeBtK6kTQKBgQDdMsW5y0w/BWuqwQGGrPsA6DdjOcJ5kuz3\nDO/NrsLOz9nKLk5bAKVhQNFJgbDqQivKlIZO77eLK2L66SyK8YrfCzzGMgVmuqeA\njFT+bg//NsdgoBcPp4Z+H/wWXXkVjRDr1JHQ7VWkPz4/7jDy8byhR9EZAMiCS3Ht\nbDyOz/503QKBgQCkZh95ETR18KC20zH7D04pgJS2/n15/GqkB9qaPF+q6PL3Onf5\nXlHaEJGq7pIHNf83ZAWQWiyiq1WUAs/qMK93v7GsJFZgMNWQZRFzv3Le4pGjhLhP\nil9CGsbn+bCc1MnFMZV6JXGkZYVjPh7QdYru7HmSlb9Ct2I+XvJJ7SMGAQKBgD5D\n3ITARWY4EGawjc1rQ/ytYWn9CFFQmoOwkJBFcXDl8ViIUGYteGA37rHSYAqRNeKA\njI4LzI7QV7xphrBV7dF7SFBCJGMWh7AX0JUORlKBCP6aEePGNIWsWzmwdjUq0GiS\nHbnCFSl24/76/axlf8Omg6WWItsKgbdjkGhjBC3BAoGAF4WsUtqIM7NcYf2UNJ31\nupVTbf+erAJ3EQPw/pDp8oufCfQfqQCP5lF0+ANILTfu7EPNfGFIoPWAd6/LP8Uc\nbJY8Lw8q0O6qTNLeoPRtecF6+SZ03qvHfN1ne37XWNQxYyDbgETMjPZvP3n123f1\ntOu3emNBBImFudRJFTWWLls=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-m8zbg@test-96f35.iam.gserviceaccount.com",
  "client_id": "114619107020117158943",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-m8zbg%40test-96f35.iam.gserviceaccount.com"
}


// Library
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require("express")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2');
const {Firestore} = require('@google-cloud/firestore');
const os = require('os')
const SocketServer = require('ws').Server


// initialization
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "test-96f35",
  databaseURL: "https://test-96f35-default-rtdb.firebaseio.com"
})
const app = express()
const ws_app = express()
const wss = new SocketServer({server:ws_app})
const firestore = new Firestore();
const PORT = 8080
const wsPORT = 8081
const user_table=firestore.collection('users')
const smtpTransport = nodemailer.createTransport(
	"smtps://baidu1pan@gmail.com:"+encodeURIComponent('a987456321')
	+ "@smtp.gmail.com:465"
); 


// helper functions
async function authenticate(req,res,next){
	const token = req.headers.authorization || req.cookies['authorization']
	try{
		const verified = await admin.auth().verifyIdToken(token)
		if(verified){
			req.header.uid = verified.uid
			res.header('uid',verified.uid)
			try{
				let user_info = await user_table.doc(verified.uid).get()
				console.log('**********')
				if(!user_info.exists){
					verified.role='member'
					verified.preferences=[]
					create_user(verified)
					console.log('created new user entry',user_info)
				}else{
					console.log('user entry',user_info._fieldsProto)
				}
				console.log('**********')
			}catch(e){
				console.log(e)
				throw(e)
			}
			req.header('user_info',verified)
			return next()
		}else{
			console.log('fail')
			return res.status(401).send('not authorized');
		}
	}catch(e){
		if(token==null)
			e='Token absent'
		else if(e.errorInfo.code=='auth/id-token-expired'){
			e='Token expired'
		}
		console.log(e)
		return res.status(401).send(e);
	}
}


async function create_user(user){
	let user_info={
		email:user.email,
		name:user.name,
		preferences:user.preferences,
		profile_icon:user.picture||null,
		role:user.role,
		verified:false
	}
	user_table.doc(user.uid).set(user_info)
	send_email(user.email,user.uid)
}

async function db_add(path,json){
	firestore.doc(path).set(json)
}

async function db_update(path,json){
	firestore.doc(path).update(json)
}

async function db_delete(path){}

async function send_email(email,identifier){
	let link="http://"+os.hostname()+"/verify?id="+identifier;
	let mailOptions={
		to : email,
		subject : "Please confirm your Email account",
		html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
	}
	smtpTransport.sendMail(mailOptions, function(e, response){
		if(e){
			console.log('error sending email',e);
		}else{
			console.log("verification mail sent");
		}
	})
}


async function verify_email(id){
	let user = await user_table.doc(id).get()
	if(user.exists){
		user_table.doc(id).update({verify:true})
		return true
	}
	return false
}


//
app.use(cookieParser());

app.use((req, res, next) => {
  console.log('-----------------------')
  console.log('Time: ', Date.now());
  next();
});


app.use((req, res, next) => {
  console.log('Request type: ', req.method);
  console.log('request body')
  console.log(req.body)
  next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/',authenticate);


app.get("/verify/", async (req, res) => {
	if(req.headers.id && verify_email(req.headers.id))
		res.send('email verified')
	else
		res.send('invalid link')
})


app.get("/", async (req, res) => {
	res.render("./public/index.html")
})


//web socket
wss.on('connection',ws=>{
console.log('[WSS] new wss connection')

	ws.on('message', data=>{
		ws.send(data)
	})
	ws.on('close',()=>{
		console.log('[WSS] dissconnected')
	})
	
})



// serve
app.listen(PORT, ()=>console.log(`serving on port ${PORT}`))
ws_app.listen(wsPORT,()=>console.log(`ws serving on port ${wsPORT}`))
