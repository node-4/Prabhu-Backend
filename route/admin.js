const { validateUser } = require("../middlewares");
const auth = require("../controllers/1adminController");
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
    app.post('/api/v1/admin/registration', auth.registration);
    app.post('/api/v1/admin/login', auth.signin);
    app.get('/api/v1/admin/getProfile', [authJwt.verifyToken], auth.getProfile);
    app.post('/api/v1/IndustryCategory/AddIndustryCategory', [authJwt.verifyToken], auth.AddIndustryCategory);
    app.get('/api/v1/IndustryCategory/getAllIndustryCategory', auth.getAllIndustryCategory);
    app.delete('/api/v1/IndustryCategory/deleteIndustryCategory/:id', [authJwt.verifyToken], auth.deleteIndustryCategory);
    app.get('/api/v1/IndustryCategory/getIndustryCategorybyId/:id', auth.getIndustryCategorybyId);
    app.post('/api/v1/IndustrySubcategory/AddIndustrySubcategory', [authJwt.verifyToken], auth.AddIndustrySubcategory);
    app.get('/api/v1/IndustrySubcategory/getAllIndustrySubcategory/:industryCategory', auth.getAllIndustrySubcategory);
    app.delete('/api/v1/IndustrySubcategory/deleteIndustrySubcategory/:id', [authJwt.verifyToken], auth.deleteIndustrySubcategory);
    app.get('/api/v1/IndustrySubcategory/getIndustrySubcategorybyId/:id', auth.getIndustrySubcategorybyId);
    app.get('/api/v1/admin/WebinarTopic/getAllPendingWebinarTopic', [authJwt.verifyToken], auth.getAllPendingWebinarTopic);
    app.get('/api/v1/admin/WebinarTopic/getAllAcceptWebinarTopic', [authJwt.verifyToken], auth.getAllAcceptWebinarTopic);
    app.get('/api/v1/admin/WebinarTopic/getAllRejectWebinarTopic', [authJwt.verifyToken], auth.getAllRejectWebinarTopic);
    app.put('/api/v1/admin/WebinarTopic/:id', [authJwt.verifyToken], auth.updateWebinarTopicbyId);
};