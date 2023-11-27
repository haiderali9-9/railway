const express = require('express');
const session = require('express-session');
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

const pool = new pg.Pool({
    host:'localhost',
    port:'5432',
    database:'railwaydb',
    user:'postgres',
    password:'1234'
});
pool.connect();

app.use(session({
    key: 'userId',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 60 * 1000,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
}));

  
app.get('/login', async (req,res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    } else {
        res.send({loggedIn: false});
    }

});

app.post('/login', async (req,res) => {
    const {email, password} = await req.body;
    const query = `SELECT * FROM passenger WHERE passenger_email = $1 AND passenger_password = $2`;
    const results = await pool.query(query, [email, password]);
    
    if (results.rows.length > 0) {
      const user = results.rows[0];
      req.session.user = user;
      res.status(200).json(user);
    } else {
      res.status(401).json({message: 'Invalid credentials'});
    }
});

app.post('/signup', async(req,res) => {
    const {name, email, phoneNumber, dateOfBirth, password} = await req.body;
    const query = `INSERT INTO passenger ( passenger_name, passenger_email, passenger_phone_number, passenger_date_of_birth, passenger_password) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query,[name, email, phoneNumber, dateOfBirth, password]);
    res.sendStatus(201);
});

app.get('/logout', async (req,res) => {
    req.session.destroy();
    res.sendStatus(200);
})
app.get('/station', async (req, res) => {
    const query = `SELECT * FROM stations`;
    const results = await pool.query(query);
    const stations = results.rows;
    res.send(stations);
});
app.post('/routes-detail', async (req, res) => {
    const {fromStation, toStation} = req.body;
    const query = `SELECT routes.id, 
    src_stations.name AS source_station, 
    dest_stations.name AS destination_station, 
    routes.distance, routes.duration, 
    train.name AS train_name FROM routes
    JOIN stations AS src_stations ON routes.source_station_id = src_stations.id
    JOIN stations AS dest_stations ON routes.destination_station_id = dest_stations.id 
    JOIN train ON routes.train_id = train.id
    WHERE src_stations.name = $1 AND dest_stations.name = $2`
    const results = await pool.query(query,[fromStation, toStation]);
    res.send(results.rows);
    
});

app.get('/train-routes', async (req, res) => {
    const query =`SELECT routes.id, 
    src_stations.name AS source_station,
    dest_stations.name AS destination_station,
    routes.distance, routes.duration, 
    train.name AS train_name FROM routes 
    JOIN stations AS src_stations ON routes.source_station_id = src_stations.id
    JOIN stations AS dest_stations ON routes.destination_station_id = dest_stations.id 
    JOIN train ON routes.train_id = train.id`;
    const results = await pool.query(query);
    res.status(200).send(results.rows);

})

app.get('/seat-details/:trainId/:routeId', async (req,res) => {
    const routeId = req.params.routeId;
    const query = `SELECT s.seat_id, s.wagon_id, s.seat_number, s.route_id, s.seat_status, w.wagon_class  FROM seat s
     JOIN wagon w ON s.wagon_id = w.wagon_id
     WHERE route_id = $1`;
    const results = await pool.query(query, [routeId]);
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
    const results = await pool.query(query);
    res.send(results.rows);
});

app.post("/ticket-reservation", async(req,res) => {
    const query = `
    INSERT INTO ticket_reservation (passenger_id, passenger_name, phone_number, passenger_cnic, train_name, wagon_id, seat_id, seat_number, booking_date, seat_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    console.log(req.body);
    const {name,phoneNumber,cnic,seat_data} = req.body;
    const seat_detail = seat_data[0];
    const route_detail = seat_data[1];
    const {seat_id,wagon_id,seat_number,seat_status} = seat_detail;
    const {train_name,id:routeId} = route_detail;
    const booking_date = new Date();
    const values = [
      req?.session?.user?.passenger_id,
      name,
      phoneNumber,
      cnic,
      train_name,
      wagon_id,
      seat_id,
      seat_number,
      booking_date,
      seat_status,
    ];
    await pool.query(query,values);
    const query2 = `UPDATE seat
          SET seat_status = 'booked' where route_id = $1 AND seat_number = $2`
    await pool.query(query2,[routeId,seat_number]);
    
    if(routeId === 2 ){
        const query = `UPDATE seat
        SET seat_status = CASE WHEN route_id = 1  THEN 'booked'
                         WHEN route_id = 3 THEN 'booked'
                         ELSE seat_status
                         END
                         WHERE seat_number = $1`;
    await pool.query(query,[seat_number]);
    }

    if(routeId === 1 || routeId === 3){
        const query = `UPDATE seat
        SET seat_status = CASE WHEN route_id = 2  THEN 'booked'
                         ELSE seat_status
                         END
                         WHERE seat_number = $1`;
    await pool.query(query, [seat_number]);
    console.log(1);
    }
    if (routeId === 5) {
      const query = `UPDATE seat
        SET seat_status = CASE WHEN route_id = 4  THEN 'booked'
                         WHEN route_id = 6 THEN 'booked'
                         ELSE seat_status
                         END
                         WHERE seat_number = $1`;
      await pool.query(query, [seat_number]);
    }
    if (routeId === 4 || routeId === 6) {
      const query = `UPDATE seat
        SET seat_status = CASE WHEN route_id = 5  THEN 'booked'
                         ELSE seat_status
                         END
                         WHERE seat_number = $1`;
      await pool.query(query, [seat_number]);
    }
    res.sendStatus(201);
});

app.get("/train-schedule", async (req, res) => {
  const query = `
      SELECT
        ts.schedule_id,
        t.name AS train_name,
        s.name AS station_name,
        ts.arrival_time,
        ts.departure_time
      FROM
        train_schedule ts
      JOIN
        train t ON ts.train_id = t.id
      JOIN
        stations s ON ts.station_id = s.id;
    `;
  const result = await pool.query(query);
  res.json(result.rows);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

  