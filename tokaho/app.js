'use strict'


// Library
const serviceAccount = require('SDK/test-96f35-firebase-adminsdk-m8zbg-84b61cb989.json')
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
