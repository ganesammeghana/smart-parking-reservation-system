const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "parking_user",
    password: "",
    database: "smart_parking"
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed:", err);
    } else {
        console.log("MySQL Connected Successfully");
    }
});

// Home Route
app.get("/", (req, res) => {
    res.send("Smart Parking Server is Running");
});

// Add Booking
app.post("/book", (req, res) => {

    const {
        username,
        name,
        vehicle_number,
        slot_number,
        booking_date,
        booking_time
    } = req.body;

    const checkSql = `
        SELECT * FROM bookings
        WHERE slot_number = ?
        AND booking_date = ?
        AND booking_time = ?
    `;

    db.query(checkSql, [slot_number, booking_date, booking_time], (err, result) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.length > 0) {
            return res.json({
                message: "Slot already booked for this date and time!"
            });
        }

        const sql = `
            INSERT INTO bookings
            (username, name, vehicle_number, slot_number, booking_date, booking_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                username,
                name,
                vehicle_number,
                slot_number,
                booking_date,
                booking_time
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    message: "Booking saved successfully!"
                });

            }
        );

    });

});

// View All Bookings
app.get("/bookings", (req, res) => {

    db.query("SELECT * FROM bookings", (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

// View Single Booking
app.get("/bookings/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM bookings WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }

            res.json(result[0]);

        }
    );

});

// Update Booking
app.put("/bookings/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        vehicle_number,
        slot_number,
        booking_date,
        booking_time
    } = req.body;

    const sql = `
        UPDATE bookings
        SET
            name = ?,
            vehicle_number = ?,
            slot_number = ?,
            booking_date = ?,
            booking_time = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            vehicle_number,
            slot_number,
            booking_date,
            booking_time,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Booking Updated Successfully"
            });

        }
    );

});
// View Logged-in User Bookings
app.get("/my-bookings/:username", (req, res) => {

    const username = req.params.username;

    const sql = "SELECT * FROM bookings WHERE username = ?";

    db.query(sql, [username], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});
// Delete Booking
app.delete("/bookings/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM bookings WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Booking Deleted Successfully"
            });

        }
    );

});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});