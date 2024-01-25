const axios = require("axios");
const server = require("./src/server");
const { conn } = require('./src/db.js');
const PORT =process.env.PORT || 3003;


// Sincronizar la base de datos
conn.sync({force:true})
  .then(() => {
    console.log('Database synchronized and connected');
  }).then(()=>{
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    })
  })
  .catch(error => console.error(error))


// conn.sync({ force: true }).then(() => {
//   console.log('Base de datos sincronizada');
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// })
// }).catch(error => console.error(error))
