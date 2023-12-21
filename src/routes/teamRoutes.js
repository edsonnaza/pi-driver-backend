const {Router} = require("express");
const teams = Router();
const {teamsGetAndSave} =require("../handlers/teamHandler")

teams.get("/teams/", teamsGetAndSave)

module.exports= teams;