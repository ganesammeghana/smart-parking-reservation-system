document.getElementById("bookingForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const data = {
        username: localStorage.getItem("username"),
        name: document.getElementById("name").value,
        vehicle_number: document.getElementById("vehicle_number").value,
        slot_number: document.getElementById("slot_number").value,
        booking_date: document.getElementById("booking_date").value,
        booking_time: document.getElementById("booking_time").value
    };

    try {

        const response = await fetch("http://localhost:5000/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if(result.message === "Booking saved successfully!"){

    localStorage.setItem("receipt", JSON.stringify(data));

    window.location.href = "receipt.html";

}else{

    alert(result.message);

}

    } catch (error) {

        alert("Server Error");

        console.log(error);

    }

});
const slotContainer = document.getElementById("slotContainer");

if(slotContainer){

fetch("http://localhost:5000/bookings")
.then(res=>res.json())
.then(data=>{

    const bookedSlots=data.map(b=>String(b.slot_number));

    for(let i=1;i<=20;i++){

        const div=document.createElement("div");

        div.innerHTML=i;

        div.classList.add("slot");

        if(bookedSlots.includes(String(i))){

            div.classList.add("booked");

        }else{

            div.onclick=function(){

                document.querySelectorAll(".slot").forEach(s=>{

                    s.classList.remove("selected");

                });

                div.classList.add("selected");

                document.getElementById("slot_number").value=i;

            };

        }

        slotContainer.appendChild(div);

    }

});

}