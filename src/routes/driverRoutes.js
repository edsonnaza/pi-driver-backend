const {Router} = require("express");
const driver = Router();
const { driverGetQuery,driverGetParams,driverPostCreateNew} =require("../handlers/driverHandler")

driver.get("/drivers/", driverGetQuery)
driver.get("/drivers/:idDriver", driverGetParams)
driver.post("/drivers/",driverPostCreateNew)

module.exports= driver;