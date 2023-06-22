const { validateUser } = require("../middlewares");
const auth = require("../controllers/user.controller");
const { authJwt, authorizeRoles } = require("../middlewares");
var multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploads"); }, filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); },
});
const upload = multer({ storage: storage });
module.exports = (app) => {
    app.post('/api/v1/user/help/addQuery', [authJwt.verifyToken], auth.AddQuery);
    app.get('/api/v1/user/help/getAllQuery', [authJwt.verifyToken], auth.getAllQuery);
};