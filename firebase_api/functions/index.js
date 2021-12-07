const functions = require('firebase-functions'); 
const admin = require("firebase-admin"); 

var serviceAccount = {
    "type": "service_account",
    "project_id": "hollysapp-53492",
    "private_key_id": "bf874cf91bed9bb0eddae577ba0ed92362d2a63e",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD1OSsLxHbKiMRo\nOs7ObAcElJkH35nwdTMsdufUmW5QFXFveyrAnIg85I7tumU7qeirDn1wWWRfxyyc\nzCKPFco/gD7Dbhpd5KqjcV1UFJ1+atzw0v39aFJKx2Alg42m/qmsa2fEGdEwV9ah\nZZmgrfFt8XwL+i1QcqOsgPQ5jWLMldhjn5xuMkMGVB9qaoO8hK2eeLrlTvcqTVTA\n0oQ/d3zZJi/lFzALX0tMeesnMFxVPdr7atXfKtJ6Lb9TAdi2edrCEyho/QDi2Gml\n99mTjKrILGCp5n53nyoGRBvQBxbn6R4GFsPT5EAppWPsh0O4UeFR6oU9pkcqBafh\noYz8lZfNAgMBAAECggEAMVQW6ebTK5JACiR8Se9WqQ/4Sapr5cA5s1HW+EAF/gOW\nPkH1O2oxiKhEbSNf7lTTOievyYwd4htniMISmJxeQxBZ78ej86vGPJsXFk0QUmgO\nOj6DO7jCxwqct2cjdUqImKfBZ6P23eXpha1xri4XYRGg7arddy+cZ5zIJBSiIXuF\nThhwLZ0rAtP1v6al1XQ65kloeN/3z8daG0wlYJ+NLwrIsfzCdp65muYUOxvUEQQz\n1Q28wH6reG3SCMsEg6PHq9mC9PAWpaYj3dUyR5RY8NcC8K7bk9AEZ4NdyQkbiVH4\nc0cx+hAA88MqSvqBvdhQRqCoyV35uDwSnmQ18XIg0QKBgQD8FH0sNWEZQz09D6/5\nRj168Mj0j95nonqIlHn3r2c5+Gu9yw2CLZpMn9Atl2OjmGX1X+xqJUuVjryKwCxp\nm2cIKjP3o8Qq17DQElHJbiP/LyqDOV2HOhwioLRPSwPEetab3npXmWVyW7i4X3gC\nbblM1ryD8U9HZ7huUoJse6aJHQKBgQD5CWIT08t8UftIt6ERn4Hje/vQGIZW/49g\n4zSsuXImMd1XVTFKByqQbsq4bT0C0pPFDo/n+egEDiluHkrHhTWzutEe4wnSc42Y\nf+JbB02A2VFUgXUXNayya6EutOk2WSOU8TY/OI8HIfEJyV4tdooIe+s7KQMpmhl6\nJ9ofFAS6cQKBgC/fPD5PDNedW13jQsoWOsrEO4WmZNhNlPOnLtqI5xOtR9jNXQ1h\n17HBj+l4nKWO5Z4Jz34BAy+t4cR/5m9P4es9CI14/mIcgCmjsQCN+CwYKvyswkRS\nFtHErzl3x4liwqrrP1SvfwKOxK/PAZ2EdPJQvZBZHXM0EWRyKu6rNN9JAoGAPmkD\nk0R4smc5OjgKvYfj3UatDLGYuSTCod1OzhqLaNcGSWSoPY0eNaQOWbnGmHZ9Yd0M\nY25Vnu6No3Mj+mx/0NL4pWzwgTVEPvuNlpJ18dyEbVEkLvTcmrouYq4j4+Li7+ij\nV6Ss83SmG3XDjFEwtn+Xq/PTPxHHYL2sBC3YIYECgYEA904WBE7uia+zjdI3k7dq\nfd/TB1vCjBl3UklemBGLEgiP+hvNzRX1AuQ7noC6D4xDcW2RA+jF0aXiHOsAmCjT\nTQ/DgF+ulcJvVray8xpFR7K21XVTeCdcv6o0CzNHbHOvac1CoGUBPnQOeKH2ce00\n2/mmJs/8/ceHP2/54U+aYnU=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-5tji1@hollysapp-53492.iam.gserviceaccount.com",
    "client_id": "100656143156354001807",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5tji1%40hollysapp-53492.iam.gserviceaccount.com"
}
  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), 
    storageBucket : "hollysapp-53492.appspot.com" 
});

const sendPush = require("./sendPush.js");

exports.sendPush = functions.https.onRequest(sendPush.sendPushHandler);