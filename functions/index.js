const functions = require('firebase-functions')
const admin = require('firebase-admin')

const express = require('express')
const app = express() 


admin.initializeApp() 

exports.getScreams = functions.https.onRequest((request, response) => {
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


exports.createScream = functions.https.onRequest((request, response) => {
    if (request.method != "POST") {
        // invalid user request 
        return response.status(400).json({error: "method not allowed"})
    }

   const newScream = {
       body: request.body.body, 
       userHandle: request.body.userHandle, 
       createdAt: admin.firestore.Timestamp.fromDate(new Date())
   }

   admin.firestore().collection("screams").add(newScream)
    .then(doc => {
        response.json({message: `document ${doc.id} created successfully`})
    })
    .catch(err => {
        // server error 
        response.status(500).json({error: 'something went wrong'})
        console.error(err)
    })
})