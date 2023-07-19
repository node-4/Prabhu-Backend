const { validateUser } = require("../middlewares");
const auth = require("../controllers/4instructorController");
const { authJwt, authorizeRoles } = require("../middlewares");
var multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploads"); }, filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); },
});
const upload = multer({ storage: storage });
module.exports = (app) => {
    app.post('/api/v1/instructor/registration', auth.registration);
    app.post('/api/v1/instructor/login', auth.signin);
    app.post('/api/v1/instructor/login/WithPhone', auth.loginWithPhone);
    app.post('/api/v1/instructor/verifyOtp/:id', auth.verifyOtp);
    app.get('/api/v1/instructor/getProfile', [authJwt.verifyToken], auth.getProfile);
    app.put('/api/v1/instructor/editProfile', [authJwt.verifyToken], auth.editProfile);
    app.post('/api/v1/instructor/resendOTP/:id', auth.resendOTP);
    app.post('/api/v1/instructor/resetPassword/:id', auth.resetPassword);
    app.post('/api/v1/instructor/socialLogin', auth.socialLogin);
    app.post('/api/v1/instructor/help/addQuery', [authJwt.verifyToken], auth.AddQuery);
    app.get('/api/v1/instructor/help/getAllQuery', [authJwt.verifyToken], auth.getAllQuery);
    app.post('/api/v1/instructor/WebinarTopic/AddWebinarTopic', [authJwt.verifyToken], auth.AddWebinarTopic);
    app.get('/api/v1/instructor/WebinarTopic/getAllWebinarTopic', [authJwt.verifyToken], auth.getAllWebinarTopic);
    app.get('/api/v1/instructor/WebinarTopic/:id', auth.getWebinarTopicbyId);
    app.put('/api/v1/instructor/WebinarTopic/:id', auth.updateWebinarTopicbyId);


};