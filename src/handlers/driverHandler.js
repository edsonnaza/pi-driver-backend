const {getAllDrivers,createDriver} = require("../controllers/driverController");
  
  const driverGetQuery = async (req, res) => {
    const { name } = req.query;
    try {
      if (name) {
        const allDrivers = await getAllDrivers(name);
        //* Only 15 first drivers
        const response = allDrivers.slice(0, 15); 
        return res.status(200).json(response);
      }
      const response = await getAllDrivers();
      return res.status(200).json(response);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
  
  const driverGetParams = async (req, res) => {
    try {
      const { idDriver } = req.params;
      const allDrivers = await getAllDrivers();
      const idExist = allDrivers.some(
        (driver) => driver.id.toString() === idDriver
      );
  
      if (idExist) {
        const driver = allDrivers.find((d) => d.id.toString() === idDriver);
        res.status(200).json(driver);
      } else {
        throw new Error(
          "Driver not found. Please double-check the ID"
        );
      }
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
  
  const driverPostCreateNew = async (req, res) => {
    const { forename, lastname, description, image_url, nationality, dob,teams } =  req.body;
    try {
      const response = await createDriver( forename, lastname, description, image_url, nationality, dob,teams )
  
      res.status(200).json(response);
      
    } catch (error) {
        res.status(404).json(error.message);    
    }
  };
  
  module.exports = {
    driverGetQuery,
    driverGetParams,
    driverPostCreateNew,
  };