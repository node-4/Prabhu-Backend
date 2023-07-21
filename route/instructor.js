const { validateUser } = require("../middlewares");
const auth = require("../controllers/4instructorController");
const { authJwt, authorizeRoles } = require("../middlewares");
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "dbrvq9uxa",
    api_key: "567113285751718",
    api_secret: "rjTsz9ksqzlDtsrlOPcTs_-QtW4",
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "images/image",
        allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
    },
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
    app.get('/api/v1/instructor/getAllIndustryCategory', auth.getAllIndustryCategory);
    app.get('/api/v1/instructor/getAllIndustrySubcategory/:industryCategory', auth.getAllIndustrySubcategory);
    app.get('/api/v1/instructor/WebinarTopic/:id', auth.getWebinarTopicbyId);
    app.post('/api/v1/instructor/Courses/AddCourses', [authJwt.verifyToken], auth.AddCourses);
    app.get('/api/v1/instructor/Courses/getAllCourses', [authJwt.verifyToken], auth.getAllCourses);
    app.get('/api/v1/instructor/Courses/:id', auth.getCoursesbyId);
    app.put('/api/v1/instructor/Courses/:id', auth.editCourses);
};