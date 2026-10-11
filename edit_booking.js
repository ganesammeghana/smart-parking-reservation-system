const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`http://localhost:5000/bookings/${id}`)
    .then(res => res.json())
    .then(booking => {

        document.getElementById("name").value = booking.name;
        document.getElementById("vehicle_number").value = booking.vehicle_number;
        document.getElementById("slot_number").value = booking.slot_number;
        document.getElementById("booking_date").value = booking.booking_date;
        document.getElementById("booking_time").value = booking.booking_time;

    })
    .catch(err => console.log(err));
    document.getElementById("editForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const booking = {
        name: document.getElementById("name").value,
        vehicle_number: document.getElementById("vehicle_number").value,
        slot_number: document.getElementById("slot_number").value,
        booking_date: document.getElementById("booking_date").value,
        booking_time: document.getElementById("booking_time").value
    };

    fetch(`http://localhost:5000/bookings/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);

        window.location.href = "view_bookings.html";
    })
    .catch(err => console.log(err));

});