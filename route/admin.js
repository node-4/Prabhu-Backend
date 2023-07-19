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
};