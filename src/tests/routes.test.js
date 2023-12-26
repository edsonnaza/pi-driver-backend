const request = require('supertest');
const app = require('../server'); // Reemplaza con la ruta correcta a tu archivo de rutas

describe('Routes Testing Drivers and Teams...', () => {

    it('Should get the home response, Wellcome to F1 World Drivers!', async ()=>{
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toEqual('Wellcome to F1 World Drivers!');
    });

  it('Should get all Drivers from the API:5000', async () => {
    const response = await request(app).get('/drivers');
    expect(response.status).toBe(200);
   // expect(response.body).toHaveLength(3); // Reemplaza con el valor correcto esperado
  });

  it('Should get the Driver detail by ID', async () => {
    const response = await request(app).get('/drivers/1');
    expect(response.status).toBe(200);

    const expectedResponse = {
        "id": 1,
        "forename": "Lewis",
        "lastname": "Hamilton",
        "nationality": "British",
        "dob": "1985-01-07",
        "teams": [
            "McLaren",
            "Mercedes"
        ],
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg",
        "description": "Sir Lewis Carl Davidson Hamilton MBE HonFREng (born 7 January 1985) is a British racing driver currently competing in Formula One, driving for Mercedes-AMG Petronas Formula One Team. In Formula One, Hamilton has won a joint-record seven World Drivers' Championship titles (tied with Michael Schumacher), and holds the records for the most wins (103), pole positions (103), and podium finishes (191), among many others. He is statistically considered as the most successful driver in Formula One history.",
        "api": true
    };

    expect(response.body).toEqual(expectedResponse);
});

it('Should get the Driver name when if searched by name', async () => {
    const response = await request(app).get('/drivers?name=Hamilton');
    expect(response.status).toBe(200);

    const expectedResponse = [
        {
            "id": 1,
            "forename": "Lewis",
            "lastname": "Hamilton",
            "nationality": "British",
            "dob": "1985-01-07",
            "teams": [
                "McLaren",
                "Mercedes"
            ],
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/1/18/Lewis_Hamilton_2016_Malaysia_2.jpg",
            "description": "Sir Lewis Carl Davidson Hamilton MBE HonFREng (born 7 January 1985) is a British racing driver currently competing in Formula One, driving for Mercedes-AMG Petronas Formula One Team. In Formula One, Hamilton has won a joint-record seven World Drivers' Championship titles (tied with Michael Schumacher), and holds the records for the most wins (103), pole positions (103), and podium finishes (191), among many others. He is statistically considered as the most successful driver in Formula One history.",
            "api": true
        }
     
    ];

    expect(response.body).toEqual(expectedResponse);
});


it('Should create a new driver', async () => {
    const response = await request(app)
      .post('/drivers')
      .send({
        forename: 'Edson',
        lastname: 'Sanchez',
        description: 'Driver Expert',
        image_url: 'https://ibb.co/3vYn6xb',
        nationality: 'Paraguayo',
        dob: '1990-01-15',
        teams: ['Mercedes'],
      });

    expect(response.status).toBe(201);  
    expect(response.body).toHaveProperty('id');
    expect(response.body.forename).toBe('Edson'); 
      
  });

  it('Should get all the Teams from the API:5000', async () => {
    const response = await request(app).get('/teams');
    expect(response.status).toBe(200);
  });

});
