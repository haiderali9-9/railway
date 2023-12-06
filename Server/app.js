const express = require('express');
const session = require('express-session');
const cors = require('cors');
const pg = require('pg');
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
let routeNumber = 0;
var passenger_id;
let routeClass;
var ticketId;

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

app.get('/login', async (req, res) => {
  try {
    if (req.session.user) {
      passenger_id = req?.session?.user?.passenger_id;
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = await req.body;
    const query = `SELECT * FROM passenger WHERE passenger_email = $1 AND passenger_password = $2`;
    const results = await pool.query(query, [email, password]);

    if (results.rows.length > 0) {
      const user = results.rows[0];
      req.session.user = user;
      passenger_id = req?.session?.user?.passenger_id;
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/signup', async(req,res) => {
  try {
    await client.query("BEGIN");
    const { name, email, phoneNumber, dateOfBirth, password } = await req.body;
    const query = `INSERT INTO passenger ( passenger_name, passenger_email, passenger_phone_number, passenger_date_of_birth, passenger_password) VALUES ($1, $2, $3, $4, $5)`;
    await pool.query(query, [name, email, phoneNumber, dateOfBirth, password]);
    await client.query("COMMIT");
    res.sendStatus(201);
  } catch (error) {
    await client.query("ROLLBACK");
    if (error.code === 'P0001') {
      res.status(500).send("Invalid Phone format");
      console.error("Invalid Phone format");
    } else {
      console.error('Error in /signup route:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/logout', async (req,res) => {
  try {
    req.session.destroy();
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in /logout route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/station', async (req, res) => {
  try {
    const query = `SELECT * FROM stations`;
    const results = await pool.query(query);
    const stations = results.rows;
    res.send(stations);
  } catch (error) {
    console.error('Error in /station route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/routes-detail', async (req, res) => {
  try {
    const { fromStation, toStation } = req.body;
    const query = `SELECT routes.id, 
      src_stations.name AS source_station, 
      dest_stations.name AS destination_station, 
      routes.distance, routes.duration, 
      train.name AS train_name FROM routes
      JOIN stations AS src_stations ON routes.source_station_id = src_stations.id
      JOIN stations AS dest_stations ON routes.destination_station_id = dest_stations.id 
      JOIN train ON routes.train_id = train.id
      WHERE src_stations.name = $1 AND dest_stations.name = $2`;
    const results = await pool.query(query,[fromStation, toStation]);
    res.send(results.rows);
  } catch (error) {
    console.error('Error in /routes-detail route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/train-routes', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in /train-routes route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/seat-details/:trainId/:routeId', async (req,res) => {
  try {
    const routeId = req.params.routeId;
    const query = `SELECT s.seat_id, s.wagon_id, s.seat_number, s.route_id, s.seat_status, w.wagon_class, w.train_id  FROM seat s
       JOIN wagon w ON s.wagon_id = w.wagon_id
       WHERE route_id = $1`;
    const results = await pool.query(query, [routeId]);
    res.send(results.rows);
  } catch (error) {
    console.error('Error in /seat-details route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/train-fares', async (req,res) => {
  try {
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
  } catch (error) {
    console.error('Error in /train-fares route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/ticket-reservation", async(req,res) => {
  try {
    await pool.query("BEGIN");
    const max = 678;
    const min = 22;
    let result = Math.random() * (max - min);
    ticketId = Math.trunc(result * result);
    const query = `
      INSERT INTO ticket_reservation (ticket_id, passenger_id, train_id, seat_id, booking_date)
      VALUES ($1, $2, $3, $4, $5)`;
    let query_cnic = `
          UPDATE passenger
          SET passenger_cnic = $1
          WHERE passenger_id = $2`;

      const {cnic,seat_data} = req.body;
      const seat_detail = seat_data[0];
      const route_detail = seat_data[1];
      const {seat_id,seat_number,wagon_class,train_id} = seat_detail;
      const {id:routeId} = route_detail;
      const booking_date = new Date();
      routeNumber = routeId;
      routeClass = wagon_class;
      
      const values = [
        ticketId,
        passenger_id,
        train_id,
        seat_id,
        booking_date,
      ];
      await pool.query(query,values);
      await pool.query(query_cnic, [cnic,passenger_id]);
     
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
      await pool.query("COMMIT");
      res.sendStatus(201);
  } catch (error) {
    // await pool.query("ROLLBACK");
    if (error.code === 'P0001') {
      res.status(500).send("Invalid CNIC format");
      console.error("Invalid CNIC format");
    } else {
    console.error('Error in /ticket-reservation route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }}
});

app.get("/train-schedule", async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error in /train-schedule route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get("/getAmountToPay", async (req, res) => {
  try {
    const query = {
      text: "SELECT price FROM fares WHERE route_id = $1 AND class = $2",
      values: [routeNumber, routeClass],
    };
    const result = await pool.query(query);
    const amountToPay = result.rows[0].price;
    res.send({ amount: amountToPay });
  } catch (error) {
    console.error('Error in /getAmountToPay route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/makePayment", async (req, res) => {
  try {
    await pool.query("BEGIN");
    const { paymentAmount, paymentMethod} = req.body;
    let paymentStatus = 'pay';
    if (!paymentAmount || !paymentStatus || !paymentMethod || !ticketId) {
    
      return res.status(400).json({ error: "Missing required fields." });
    }
    const insertQuery = {
      text: `
        INSERT INTO payment (payment_amount, payment_status, payment_method, ticket_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      values: [paymentAmount, paymentStatus, paymentMethod, ticketId],
    };

    const result = await pool.query(insertQuery);
    await pool.query("COMMIT");
    const paymentId = result.rows[0].payment_id;

    res.status(201).json({ paymentId, success: true, message: "Payment successful." });
  } catch (error) {
     await pool.query("ROLLBACK");
    console.error('Error in /makePayment route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get("/print_ticket", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `
      SELECT
          tr.ticket_id,
          tr.passenger_id,
          tr.seat_id,
          tr.booking_date,
          p.passenger_name,
          p.passenger_email,
          s.wagon_id,
          s.seat_number,
          t.name AS train_name
      FROM
          ticket_reservation tr
      JOIN
          passenger p ON tr.passenger_id = p.passenger_id
      JOIN
          seat s ON tr.seat_id = s.seat_id
      JOIN
          routes r ON r.id = s.route_id
      JOIN
          train t ON t.id = r.train_id
      WHERE
          tr.passenger_id = $1
    `,
      [passenger_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error in /print_ticket route:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});