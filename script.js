function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    // Change active menu
    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    event.currentTarget.classList.add("active");
}


// Search bookings

function searchBookings() {

    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();

    const rows = document.querySelectorAll("#bookingTable tbody tr");

    rows.forEach(row => {

        const guestName = row.cells[0].textContent.toLowerCase();

        if (guestName.includes(filter)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
}


// Open booking form

function openBookingForm() {
    document.getElementById("bookingModal").style.display = "block";
}


// Close booking form

function closeBookingForm() {
    document.getElementById("bookingModal").style.display = "none";
}


// Add new booking

function addBooking(event) {

    event.preventDefault();

    const guestName = document.getElementById("guestName").value;
    const roomNumber = document.getElementById("roomNumber").value;
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;

    // Format dates
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    const formattedIn = inDate.toLocaleDateString("en-IN");
    const formattedOut = outDate.toLocaleDateString("en-IN");

    // Add row to booking table
    const table = document.querySelector("#bookingTable tbody");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${guestName}</td>
        <td>${roomNumber}</td>
        <td>${formattedIn}</td>
        <td>${formattedOut}</td>
        <td>
            <span class="status confirmed">
                Confirmed
            </span>
        </td>
    `;

    table.appendChild(row);

    // Update booking count
    const bookingCount = document.getElementById("bookingCount");

    bookingCount.textContent =
        parseInt(bookingCount.textContent) + 1;

    // Close modal
    closeBookingForm();

    // Reset form
    document.querySelector("form").reset();

    alert("Booking created successfully!");
}


// Save settings

function saveSettings() {
    alert("Settings saved successfully!");
}


// Close modal when clicking outside

window.onclick = function(event) {

    const modal = document.getElementById("bookingModal");

    if (event.target === modal) {
        modal.style.display = "none";
    }

};
