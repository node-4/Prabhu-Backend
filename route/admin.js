const { validateUser } = require("../middlewares");
const auth = require("../controllers/1adminController");
const { authJwt, authorizeRoles } = require("../middlewares");
var multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploads"); }, filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); },
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
};