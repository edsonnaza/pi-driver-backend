
const axios = require("axios");
const { Driver, Team } = require("../db");
const backup= "https://lh3.googleusercontent.com/pw/AIL4fc_irPj-zC5X-8l5pyb_Nbp77KZEb6iHx9kFHAKi0HSkYXIMOfO-rV2DCgbCNBxWDkmvaidBg7xyYSNKTH0TjPcxZvt5Hy-egA8a71VLflpGXimStn100xDtD0seXi5-ysPGJZVw0YH8u5kHVtQ2B2ZLzg=w785-h651-s-no?authuser=0"


const createDriver = async (
  forename,
  lastname,
  description,
  image_url,
  nationality,
  dob,
  teams
) => {
  if(!image_url) image_url= backup
  else if(image_url.length<4) image_url= backup

  
  const newDriver = await Drivers.create({
    forename,
    lastname,
    description,
    image_url,
    nationality,
    dob,
  });

  const foundTeams = await Promise.all(
    teams.map(async (t) => {
      const [createdTeam] = await Teams.findOrCreate({
        where: { teams: t },
      });
      return createdTeam;
    })
  );

  await newDriver.addTeams(foundTeams);
  const teamsArray = foundTeams.map((t) => t.teams);
 

  return {
    id: newDriver.id,
    forename: newDriver.forename,
    lastname: newDriver.lastname,
    description: newDriver.description,
    image_url: newDriver.image_url,
    nationality: newDriver.nationality,
    dob: newDriver.dob,
    teams: teamsArray,
    api:false
    
  };
};

const getDriversapi = async () => {
  const response = (await axios.get("http://localhost:5000/drivers")).data;
  let teamsArray = [];
  const allDrivers = response.map((a) => {
    const { id, name, description, image, nationality, dob } = a;
    if (a.teams) {
      teamsArray = a.teams.split(",").map((team) => team.trim());
    }
    

    if(a.image.url.length<4){

     
      return {
        id,
        forename: name.forename,
        lastname: name.surname,
        nationality,
        dob,
        teams: teamsArray,
        image_url: backup,
        description,
        api:true
      }
    }

    return {
      id,
      forename: name.forename,
      lastname: name.surname,
      nationality,
      dob,
      teams: teamsArray,
      image_url: image.url,
      description,
      api:true
    };
  });
  
  return allDrivers;
};

const getDriversDB = async () => {
  const allDrivers = await Driver.findAll({
    include: [
      {
        model: Team,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    ],
  });


  const cleanDrivers = await Promise.all(
    allDrivers.map(async (d) => {
      const teamsArray = d.Teams.map((team) => team.teams);
      return {
        id: d.id,
        forename: d.forename,
        lastname: d.lastname,
        description: d.description,
        image_url: d.image_url,
        nationality: d.nationality,
        dob: d.dob,
        teams: teamsArray,
        api:false
      };
    })
  );

  return cleanDrivers;
};


const getAllDrivers = async (name) => {
  const driversApi = await getDriversapi();
  const driversDB = await getDriversDB();
  const allDrivers = [...driversApi, ...driversDB];
  if (!allDrivers.length) throw new Error("No drivers found");
  if (name) {
    const filterDrivers = allDrivers.filter(
      (d) =>
        d.forename.toLowerCase().includes(name.toLowerCase()) ||
        d.lastname.toLowerCase().includes(name.toLowerCase())
    );
    return filterDrivers;
  }

  return allDrivers;
};

module.exports = {
  getDriversapi,
  getAllDrivers,
  getDriversDB,
  createDriver,
};


// const {Driver, Team, sequelize }= require('../db');


// const driverController = {
//     getAllDrivers: async (req,res) =>{
//       try {
//         // Get data from the json file with fetch
//         const response = await fetch("http://localhost:5000/drivers");
//         const driversFromAPIJson = await response.json();

//         // Verificar si la propiedad 'drivers' existe y es iterable
//         if (
//             driversFromAPIJson &&
//             driversFromAPIJson.drivers &&
//             Symbol.iterator in Object(driversFromAPIJson.drivers)
//         ) {
//             // Get all drivers from the DDBB
//             const driversFromDDBB = await Driver.findAll({ include: [{ model: Team }] });

//             // Mix both information form the Local API:5000 and the DDBB
//             const allDrivers = [...driversFromAPIJson.drivers, ...driversFromDDBB];

//             // Adding and image by default if is not has it.
//             const driversWithDefaultImage = allDrivers.map((driver) => ({
//                 ...driver,
//                 image: driver.image || {
//                     url: "../assets/noimage.png",
//                     imageby: "unknown",
//                 },
//             }));

//             res.json(driversWithDefaultImage);
//         } else {
//           res.status(500).json({ error: "Invalid data format from the API" });
//         }
//     } catch (error) {
       
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
//     },

//     getDriverById: async (req, res) => {
//         try {
//           const { idDriver } = req.params;
    
//           // Try to get the driver from the DDBB by ID
//           const driverFromDB = await Driver.findByPk(idDriver, {
//             include: [{ model: Team }],
//           });
    
//           if (driverFromDB) {
//             // Adding image by default
//             driverFromDB.image = driverFromDB.image || {
//               url: "../assets/noimage.png",
//               imageby: "unknown",
//             };
    
//             res.json(driverFromDB);
//           } else {
//             // If not found in the DDBB, try to get from the  JSON (local:5000, API) using fetch
//             const response = await fetch("http://localhost:5000/drivers"); 
//             const driversFromJson = await response.json();
//             const driverFromJson = driversFromJson.drivers.find(
//               (driver) => driver.id === parseInt(idDriver)
//             );
    
//             if (driverFromJson) {
//               // Adding image by default when is no image
//               driverFromJson.image = driverFromJson.image || {
//                 url: "../assets/noimage.png",
//                 imageby: "Unknown",
//               };
    
//               res.json(driverFromJson);
//             } else {
//               res.status(404).json({ error: "Driver not found" });
//             }
//           }
//         } catch (error) {
//           console.error(error);
//           res
//             .status(500)
//             .json({ error: "Error to get the driver detail" });
//         }
//       },
    
//       searchDriversByName: async (req, res) => {
//         try {
//           const { name } = req.query;
    
//           // Looking for driver in the DDBB by name
//           const driversFromDB = await Driver.findAll({
//             where: {
//               [Op.or]: [
//                 sequelize.where(
//                   sequelize.fn("LOWER", sequelize.col("name.forename")),
//                   "LIKE",
//                   `%${name.toLowerCase()}%`
//                 ),
//                 sequelize.where(
//                   sequelize.fn("LOWER", sequelize.col("name.surname")),
//                   "LIKE",
//                   `%${name.toLowerCase()}%`
//                 ),
//               ],
//             },
//             limit: 15,
//             include: [{ model: Team }],
//           });
    
//           // Search drivers in the JSON file using fetch
//           const response = await fetch("http://localhost:5000/drivers");  
//           const driversFromJson = await response.json();
//           const filteredDrivers = driversFromJson.drivers.filter(
//             (driver) =>
//               driver.name.forename.toLowerCase().includes(name.toLowerCase()) ||
//               driver.name.surname.toLowerCase().includes(name.toLowerCase())
//           );
    
//           // Mixing the result
//           const searchResults = [...driversFromDB, ...filteredDrivers];
    
//           if (searchResults.length > 0) {
//             // Adding image by default to all drivers with no image. 
//             const resultsWithDefaultImage = searchResults.map((driver) => ({
//               ...driver,
//               image: driver.image || {
//                 url: "../assets/noimage.png",
//                 imageby: "unknown",
//               },
//             }));
//             res.json(resultsWithDefaultImage);
//           } else {
//             res
//               .status(404)
//               .json({ message: "No data found, please try again." });
//           }
//         } catch (error) {
//           console.error(error);
//           res
//             .status(500)
//             .json({ error: "Error, something went wrong to find by driver by name, please try later!" });
//         }
//       },
    
//       createDriver: async (req, res) => {
//         try {
//           const { forename, surname, teams } = req.body;
    
//           // Create a new driver with teams realationship.
//           const newDriver = await Driver.create({
//             name: { forename, surname },
//             // ...others driver fields
//           });
    
//           await newDriver.addTeams(teams); // Relationship the new driver with all the teams.
    
//           res.json(newDriver);
//         } catch (error) {
//           console.error(error);
//           res.status(500).json({ error: "Error to create a new driver, please try later!"});
//         }
//       },
//     };
    
//     module.exports = driverController;
