const express = require('express');
const cors = require('cors');
const pg = require('pg');
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:1234',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));


  
const client = new pg.Client({
    host:'localhost',
    port:'5432',
    database:'railwaydb',
    user:'postgres',
    password:'1234'
});
client.connect();
app.post('/', async (req,res) => {
    const {email, password} = await req.body;
    const query = `SELECT * FROM passenger WHERE passenger_email = $1 AND passenger_password = $2`;
    const results = await client.query(query, [email, password]);
    
    if (results.rows.length > 0) {
      const user = results.rows[0];
      res.json(user);
    } else {
      res.sendStatus(401);
    }
});

app.post('/signup', async(req,res) => {
    const {name, email, phoneNumber, dateOfBirth, password} = await req.body;
    const query = `INSERT INTO passenger ( passenger_name, passenger_email, passenger_phone_number, passenger_date_of_birth, passenger_password) VALUES ($1, $2, $3, $4, $5)`;
    await client.query(query,[name, email, phoneNumber, dateOfBirth, password]);
    res.sendStatus(201);
});

app.get('/station', async (req, res) => {
    const query = `SELECT * FROM stations`;
    const results = await client.query(query);
    const stations = results.rows;
    res.send(stations);
});
app.post('/routes-detail', async (req, res) => {
    const {fromStation, toStation} = req.body;
    const query = 'SELECT routes.id, src_stations.name AS source_station, dest_stations.name AS destination_station, routes.distance, routes.duration, train.name AS train_name FROM routes JOIN stations AS src_stations ON routes.source_station_id = src_stations.id JOIN stations AS dest_stations ON routes.destination_station_id = dest_stations.id JOIN train ON routes.train_id = train.id WHERE src_stations.name = $1 AND dest_stations.name = $2'
    const results = await client.query(query,[fromStation, toStation]);
    res.send(results.rows);
    
});
app.get('/seat-details/:trainId/:routeId', async (req,res) => {
    const routeId = req.params.routeId;
    const query = 'SELECT * FROM seat WHERE route_id = $1';
    const results = await client.query(query, [routeId]);
    res.send(results.rows);
})
app.get('/train-fares', async (req,res) => {
    const query = `SELECT
    f.id AS fare_id,
    f.route_id AS fare_route_id,
    f.class AS fare_class,
    f.price AS fare_price,
    s_from.name AS from_station,
    s_to.name AS to_station
         FROM fares AS f
         JOIN routes AS r ON f.route_id = r.id
         JOIN stations AS s_from ON r.source_station_id = s_from.id
         JOIN stations AS s_to ON r.destination_station_id = s_to.id`;
    const results = await client.query(query);
    res.send(results.rows);
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
