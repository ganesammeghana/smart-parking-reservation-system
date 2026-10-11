console.log("JS Loaded");

fetch("http://localhost:5000/bookings")
.then(response => response.json())
.then(data => {

    const table = document.querySelector("#bookingTable tbody");

    const search = document.getElementById("search");

    data.forEach(booking => {

        const row = `
        <tr>
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.vehicle_number}</td>
            <td>${booking.slot_number}</td>
            <td>${booking.booking_date}</td>
            <td>${booking.booking_time}</td>
            <td>

                <button
                class="btn btn-warning btn-sm"
                onclick="editBooking(${booking.id})">
                Edit
                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="deleteBooking(${booking.id})">
                Delete
                </button>

            </td>
        </tr>
        `;

        table.innerHTML += row;

    });

    search.addEventListener("keyup", function(){

        const value = search.value.toLowerCase();

        const rows = document.querySelectorAll("#bookingTable tbody tr");

        rows.forEach(row=>{

            const vehicle=row.cells[2].textContent.toLowerCase();

            if(vehicle.includes(value)){
                row.style.display="";
            }
            else{
                row.style.display="none";
            }

        });

    });

});

function deleteBooking(id){

    if(confirm("Are you sure?")){

        fetch(`http://localhost:5000/bookings/${id}`,{

            method:"DELETE"

        })

        .then(res=>res.json())

        .then(data=>{

            alert(data.message);

            location.reload();

        });

    }

}

function editBooking(id){

    window.location.href=`edit_booking.html?id=${id}`;

}

function downloadPDF(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text("Smart Parking Bookings",14,15);

    doc.autoTable({

        html:"#bookingTable",

        startY:25

    });

    doc.save("SmartParkingBookings.pdf");

}