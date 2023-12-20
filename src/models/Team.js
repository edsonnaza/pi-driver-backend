const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Team', {
    id:{
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique:true,
      allowNull:false,
      primaryKey:true,

    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    
     
  },{timestamp:false},);
};