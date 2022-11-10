const express= require("express")
const api = express();
const multer  = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../medias/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpeg|png)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

api.post('/upload', async(req, res) => {
     // 'profile_pic' is the name of our file input field in the HTML form
     let upload = multer({ storage: storage, fileFilter: imageFilter }).single('media');
     upload(req, res, function(err) {
         // req.file contains information of uploaded file
 
         if (req.fileValidationError) {
             return res.send(req.fileValidationError);
         }
         else if (!req.file) {
             return res.send('Please select an image to upload');
         }
         else if (err instanceof multer.MulterError) {
             return res.send(err);
         }
         else if (err) {
             return res.send(err);
         }
 
         // Display uploaded image for user validation
         res.send(req.file.filename);
     });
 });

api.post('/access/:mediaid', async(req, res) => {
    res.sendFile(`../medias/${req.params.mediaid}`)
})