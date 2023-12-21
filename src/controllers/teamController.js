const axios = require("axios");
const { Team } = require("../db");

const getAllTeamsDB = async () => {
  const response = (await axios.get("http://localhost:5000/drivers")).data;
  let teamsApi = [];

  response.forEach((d) => {
    if (d.teams) {
      let teamsArray = d.teams.split(",").map((team) => team.trim());
      teamsApi.push(...teamsArray);
    }
  });
  let teamsUnicos = [...new Set(teamsApi)];
  teamsUnicos.forEach(async (t) => {
    await Team.findOrCreate({
      where: {
        name: t,
      },
    });
  });

 
   
  console.log("Team created successfully!");
};

const cleanAllTeamsDB = async () => {
  const cleanTeams = [];
  const allTeams = await Team.findAll();
  allTeams.map(async (t) => {
    cleanTeams.push(t.name);
  });

  return cleanTeams;
};

module.exports = {
  getAllTeamsDB,cleanAllTeamsDB
};