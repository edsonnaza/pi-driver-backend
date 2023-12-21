const { Router } = require("express");

const router = Router();
const drivers = require('./driverRoutes');
const teams = require('./teamRoutes');


router.get('/', function (req, res) {
    //Ruta para un GET a /
    res.send('Wellcome to F1 world drivers!'); // response "Hola mundo!" en la pagina principal
 });
router.use('/',drivers);
router.use('/',teams);


module.exports = router;
