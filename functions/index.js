const functions = require('firebase-functions')
const admin = require('firebase-admin')

const express = require('express')
const app = express() 


admin.initializeApp() 

app.get('/screams', (req, res) => {
    admin.firestore().collection('screams').get()
    .then(data => {
        let screams = [] 
        data.forEach(doc => {
            screams.push(doc.data())
        });
        return response.json(screams)
    })
    .catch(error => console.error(error.message))
})

app.post('/scream', (req, res) => {
   const newScream = {
       body: req.body.body, 
       userHandle: req.body.userHandle, 
       createdAt: admin.firestore.Timestamp.fromDate(new Date())
   }

   admin.firestore().collection("screams").add(newScream)
    .then(doc => res.json({message: `document ${doc.id} created successfully`}))
    .catch(err => {
        // server error 
        res.status(500).json({error: 'something went wrong'})
        console.error(err)
    })
})

// https://baseurl.com/api/scream 

exports.api = functions.https.onRequest(app) 
