/* ================= HOSTEL SELECTION ================= */
function selectHostel(hostelName) {
    localStorage.setItem("hostel", hostelName);
    window.location.href = "floors.html";
}

/* ================= FLOOR SELECTION ================= */
function selectFloor(floor) {
    localStorage.setItem("floor", floor);
    window.location.href = "rooms.html";
}

/* ================= DEFAULT ROOMS ================= */
const defaultRooms = {
    "101": { total: 4, booked: 0 },
    "102": { total: 5, booked: 0 },
    "103": { total: 6, booked: 0 }
};

/* ================= INIT DATA ================= */
if (!localStorage.getItem("roomsData_Girls Hostel")) {
    localStorage.setItem(
        "roomsData_Girls Hostel",
        JSON.stringify(defaultRooms)
    );
}

if (!localStorage.getItem("roomsData_Boys Hostel")) {
    localStorage.setItem(
        "roomsData_Boys Hostel",
        JSON.stringify(defaultRooms)
    );
}

if (!localStorage.getItem("bookings")) {
    localStorage.setItem("bookings", JSON.stringify({}));
}

/* ================= LOAD ROOMS ================= */
function loadRooms() {
    const hostel = localStorage.getItem("hostel");
    const rooms = JSON.parse(
        localStorage.getItem("roomsData_" + hostel)
    );

    const tbody = document.getElementById("roomsBody");
    tbody.innerHTML = "";

    for (let room in rooms) {
        const total = rooms[room].total;
        const booked = rooms[room].booked;
        const available = total - booked;

        let cls = "available";
        let displayAvailable = available;

        if (available === 0) {
            cls = "booked";
            displayAvailable = "FILLED";
        } else if (available <= total / 2) {
            cls = "half";
        }

        tbody.innerHTML += `
            <tr>
                <td>${room}</td>
                <td>${total}</td>
                <td class="${cls}">${displayAvailable}</td>
                <td>${booked}</td>
                <td>
                    <button onclick="bookRoom('${room}')">Book</button>
                </td>
            </tr>
        `;
    }
}

/* ================= BOOK ROOM ================= */
function bookRoom(room) {
    localStorage.setItem("selectedRoom", room);
    window.location.href = "register.html";
}

/* ================= REGISTRATION ================= */
function continuePay() {
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();

    if (!name || !roll || !email || !pass) {
        alert("Please fill ALL fields");
        return;
    }

    if (!email.endsWith("@srit.ac.in")) {
        alert("Use SRIT college email only");
        return;
    }

    const bookings = JSON.parse(localStorage.getItem("bookings"));
    if (bookings[roll]) {
        alert("This roll number already booked a room");
        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("roll", roll);
    localStorage.setItem("email", email);

    window.location.href = "payment.html";
}

/* ================= PAYMENT ================= */
function pay(app) {
    const hostel = localStorage.getItem("hostel");
    const room = localStorage.getItem("selectedRoom");
    const roll = localStorage.getItem("roll");

    const rooms = JSON.parse(
        localStorage.getItem("roomsData_" + hostel)
    );
    const bookings = JSON.parse(localStorage.getItem("bookings"));

    if (rooms[room].booked >= rooms[room].total) {
        alert("No cots available");
        return;
    }

    rooms[room].booked++;

    bookings[roll] = {
        hostel: hostel,
        room: room,
        floor: localStorage.getItem("floor"),
        amount: 75000,
        paid: true
    };

    localStorage.setItem(
        "roomsData_" + hostel,
        JSON.stringify(rooms)
    );
    localStorage.setItem("bookings", JSON.stringify(bookings));

    window.location.href = "success.html";
}

/* ================= RECEIPT (FIXED) ================= */
function loadReceipt() {
    const roll = localStorage.getItem("roll");
    const bookings = JSON.parse(localStorage.getItem("bookings"));

    if (!roll || !bookings || !bookings[roll]) {
        alert("No booking found");
        return;
    }

    document.getElementById("rName").innerText =
        localStorage.getItem("name");

    document.getElementById("rRoll").innerText =
        roll;

    document.getElementById("rEmail").innerText =
        localStorage.getItem("email");

    document.getElementById("rHostel").innerText =
        bookings[roll].hostel;

    if (document.getElementById("rFloor")) {
        document.getElementById("rFloor").innerText =
            bookings[roll].floor;
    }

    document.getElementById("rRoom").innerText =
        bookings[roll].room;
}


/* ================= VALIDATIONS ================= */
function validateName(){
    nameError.innerText = "";
    nameTick.style.display = "none";
    if(nameInput.value.trim() === ""){
        nameError.innerText = "Name is required";
    }else{
        nameTick.style.display = "inline";
    }
}

function validateRoll(){
    rollError.innerText = "";
    rollTick.style.display = "none";
    if(rollInput.value.trim() === ""){
        rollError.innerText = "Roll number is required";
    }else{
        rollTick.style.display = "inline";
    }
}

function validateEmail(){
    emailError.innerText = "";
    emailTick.style.display = "none";
    if(!emailInput.value.trim().endsWith("@srit.ac.in")){
        emailError.innerText = "Use SRIT email only";
    }else{
        emailTick.style.display = "inline";
    }
}

function validatePass(){
    passError.innerText = "";
    passTick.style.display = "none";
    if(passInput.value.trim().length < 4){
        passError.innerText = "Minimum 4 characters required";
    }else{
        passTick.style.display = "inline";
    }
}

/* ================= PRINT RECEIPT ================= */
function printReceipt() {
    window.print();
}
