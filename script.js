
const STORAGE_KEY = "hotelProBookings";

// Sample bookings for the first visit
const sampleBookings = [
    {
        id: 1,
        name: "Rahul",
        phone: "9876543210",
        email: "rahul@gmail.com",
        room: 102,
        date: "2026-11-16",
        status: "Confirmed"
    },
    {
        id: 2,
        name: "Priya",
        phone: "9876501234",
        email: "priya@gmail.com",
        room: 104,
        date: "2026-11-17",
        status: "Checked In"
    },
    {
        id: 3,
        name: "Arjun",
        phone: "9876512345",
        email: "arjun@gmail.com",
        room: 106,
        date: "2026-11-18",
        status: "Pending"
    }
];

// Load saved bookings from browser storage
function loadBookings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : sampleBookings;
    } catch (error) {
        return sampleBookings;
    }
}

let bookings = loadBookings();

// Save bookings in browser storage
function saveBookings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

// Create 50 hotel rooms
const rooms = [];

for (let i = 101; i <= 150; i++) {
    let type = "Single";
    let price = 1500;

    if (i % 4 === 0) {
        type = "Deluxe";
        price = 2500;
    } else if (i % 4 === 1) {
        type = "Double";
        price = 2000;
    } else if (i % 4 === 2) {
        type = "Luxury Suite";
        price = 4000;
    }

    rooms.push({
        number: i,
        type: type,
        price: price
    });
}

// Find room information
function getRoom(roomNumber) {
    return rooms.find(room => room.number === Number(roomNumber));
}

// Check whether a room is booked
function isRoomBooked(roomNumber) {
    return bookings.some(booking =>
        booking.room === Number(roomNumber)
    );
}

// Escape text before displaying it in HTML
function safeText(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const symbols = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return symbols[character];
    });
}

// Dashboard summary cards
function showCards() {
    const bookedCount = rooms.filter(room =>
        isRoomBooked(room.number)
    ).length;

    const availableCount = rooms.length - bookedCount;

    const totalRevenue = bookings.reduce((total, booking) => {
        const room = getRoom(booking.room);
        return total + (room ? room.price : 0);
    }, 0);

    return `
        <div class="cards">
            <div class="card">
                <p>Total Rooms</p>
                <h2>${rooms.length}</h2>
            </div>

            <div class="card">
                <p>Available Rooms</p>
                <h2>${availableCount}</h2>
            </div>

            <div class="card">
                <p>Booked Rooms</p>
                <h2>${bookedCount}</h2>
            </div>
        </div>
    `;
}

// Show different sections
function showPage(page) {
    const content = document.getElementById("content");
    const title = document.getElementById("pageTitle");

    if (page === "rooms") {
        title.textContent = "Room Management";
        renderRooms();
    }

    else if (page === "bookings") {
        title.textContent = "Booking Management";
        renderBookings();
    }

    else if (page === "customers") {
        title.textContent = "Customer Management";
        renderCustomers();
    }

    else if (page === "revenue") {
        title.textContent = "Revenue Analytics";
        renderRevenue();
    }
}

// Room management screen
function renderRooms(searchText = "") {
    const content = document.getElementById("content");

    const bookedCount = rooms.filter(room =>
        isRoomBooked(room.number)
    ).length;

    const availableCount = rooms.length - bookedCount;

    const filteredRooms = rooms.filter(room =>
        String(room.number).includes(searchText.toLowerCase()) ||
        room.type.toLowerCase().includes(searchText.toLowerCase())
    );

    content.innerHTML = `
        ${showCards()}

        <div class="panel">
            <h2>All Room Details</h2>

            <input class="search" id="roomSearch"
                placeholder="Search room number or type..."
                value="${safeText(searchText)}">

            <table>
                <tr>
                    <th>Room Number</th>
                    <th>Room Type</th>
                    <th>Price / Night</th>
                    <th>Status</th>
                </tr>

                ${filteredRooms.map(room => {
        const booked = isRoomBooked(room.number);

        return `
                        <tr>
                            <td>${room.number}</td>
                            <td>${room.type}</td>
                            <td>₹${room.price}</td>
                            <td>
                                <span class="status ${booked ? "booked" : ""}">
                                    ${booked ? "Booked" : "Available"}
                                </span>
                            </td>
                        </tr>
                    `;
    }).join("")}
            </table>

            <p class="message">
                ${availableCount} rooms available out of ${rooms.length}.
            </p>
        </div>
    `;

    document.getElementById("roomSearch").addEventListener("input", function () {
        renderRooms(this.value);
    });
}

// Booking management screen
function renderBookings(searchText = "") {
    const content = document.getElementById("content");

    const filteredBookings = bookings.filter(booking =>
        booking.name.toLowerCase().includes(searchText.toLowerCase()) ||
        String(booking.room).includes(searchText.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchText.toLowerCase())
    );

    const availableRooms = rooms.filter(room =>
        !isRoomBooked(room.number)
    );

    content.innerHTML = `
        ${showCards()}

        <div class="panel">
            <h2>Add New Booking</h2>

            <form class="add-form" id="bookingForm">
                <input id="customerName" placeholder="Customer Name" required>
                <input id="customerPhone" placeholder="Phone Number"
                    type="tel" pattern="[0-9]{10}" title="Enter 10 digit phone number" required>
                <input id="customerEmail" placeholder="Email Address"
                    type="email" required>

                <select id="roomChoice" required>
                    <option value="">Select Available Room</option>
                    ${availableRooms.map(room => `
                        <option value="${room.number}">
                            ${room.number} - ${room.type} (₹${room.price})
                        </option>
                    `).join("")}
                </select>

                <input type="date" id="checkInDate" required>

                <select id="bookingStatus">
                    <option>Confirmed</option>
                    <option>Pending</option>
                    <option>Checked In</option>
                </select>

                <button class="add" type="submit">+ Add Booking</button>
            </form>

            <p id="formMessage" class="message"></p>
        </div>

        <div class="panel">
            <h2>All Bookings</h2>

            <input class="search" id="bookingSearch"
                placeholder="Search customer, room or status..."
                value="${safeText(searchText)}">

            <table>
                <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Room</th>
                    <th>Check In</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>

                ${filteredBookings.map(booking => `
                    <tr>
                        <td>${safeText(booking.name)}</td>
                        <td>${safeText(booking.phone)}</td>
                        <td>${booking.room}</td>
                        <td>${safeText(booking.date)}</td>
                        <td>${safeText(booking.status)}</td>
                        <td>
                            <button class="delete"
                                onclick="deleteBooking(${booking.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </table>

            ${filteredBookings.length === 0 ? "<p>No bookings found.</p>" : ""}
        </div>
    `;

    document.getElementById("bookingForm").addEventListener("submit", addBooking);

    document.getElementById("bookingSearch").addEventListener("input", function () {
        renderBookings(this.value);
    });
}

// Add a booking
function addBooking(event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const roomNumber = Number(document.getElementById("roomChoice").value);
    const date = document.getElementById("checkInDate").value;
    const status = document.getElementById("bookingStatus").value;

    if (!name || !phone || !email || !roomNumber || !date) {
        alert("Please fill in all booking details.");
        return;
    }

    if (!getRoom(roomNumber) || isRoomBooked(roomNumber)) {
        alert("This room is not available. Please select another room.");
        return;
    }

    const newBooking = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        room: roomNumber,
        date: date,
        status: status
    };

    bookings.push(newBooking);

    saveBookings();
    showPage("bookings");
}

// Delete a booking
function deleteBooking(id) {
    const confirmDelete = confirm("Do you want to delete this booking?");

    if (!confirmDelete) {
        return;
    }

    bookings = bookings.filter(booking => booking.id !== id);

    saveBookings();
    showPage("bookings");
}

// Customer management screen
function renderCustomers(searchText = "") {
    const content = document.getElementById("content");

    const filteredCustomers = bookings.filter(person =>
        person.name.toLowerCase().includes(searchText.toLowerCase()) ||
        person.phone.includes(searchText) ||
        person.email.toLowerCase().includes(searchText.toLowerCase())
    );

    content.innerHTML = `
        ${showCards()}

        <div class="panel">
            <h2>Customer Details</h2>

            <input class="search" id="customerSearch"
                placeholder="Search name, phone or email..."
                value="${safeText(searchText)}">

            <table>
                <tr>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Email</th>
                    <th>Room</th>
                </tr>

                ${filteredCustomers.map(person => `
                    <tr>
                        <td>${safeText(person.name)}</td>
                        <td>${safeText(person.phone)}</td>
                        <td>${safeText(person.email)}</td>
                        <td>${person.room}</td>
                    </tr>
                `).join("")}
            </table>

            ${filteredCustomers.length === 0 ? "<p>No customers found.</p>" : ""}
        </div>
    `;

    document.getElementById("customerSearch").addEventListener("input", function () {
        renderCustomers(this.value);
    });
}

// Revenue screen
function renderRevenue() {
    const content = document.getElementById("content");

    const totalRevenue = bookings.reduce((total, booking) => {
        const room = getRoom(booking.room);
        return total + (room ? room.price : 0);
    }, 0);

    const bookedCount = bookings.length;

    content.innerHTML = `
        <div class="cards">
            <div class="card">
                <p>Estimated Booking Value</p>
                <h2>₹${totalRevenue.toLocaleString("en-IN")}</h2>
            </div>

            <div class="card">
                <p>Total Bookings</p>
                <h2>${bookedCount}</h2>
            </div>

            <div class="card">
                <p>Available Rooms</p>
                <h2>${rooms.filter(room => !isRoomBooked(room.number)).length}</h2>
            </div>
        </div>

        <div class="panel">
            <h2>Room Booking Report</h2>

            <p>Booked Rooms</p>
            <div class="bar">
                <div class="bar-fill"
                    style="width:${(bookedCount / rooms.length) * 100}%">
                </div>
            </div>

            <p>${bookedCount} out of ${rooms.length} rooms are booked.</p>
            <p>Revenue is estimated using one night's room price per booking.</p>
        </div>
    `;
}

// Open dashboard
showPage("rooms");
