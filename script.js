document.addEventListener('DOMContentLoaded', function () {
    let button = document.getElementById('Appetisers');
    button.classList.add("pressed");
    showMenu(button.id);
});
// document.addEventListener('DOMContentLoaded', function () {
//     document.querySelectorAll('.menu-btn').forEach(el => {
//         el.addEventListener('click', () => {
//             // Reset all buttons by removing the 'pressed' class
//             document.querySelectorAll('.menu-btn').forEach(button => {
//                 button.classList.remove('pressed');
//             });

//             // Add 'pressed' class to the clicked button
//             el.classList.add('pressed');
//             showMenu(el.id);
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    // Loop through all elements with the class 'menu-choose'
    document.querySelectorAll(".menu-choose").forEach(e => {
        // Add a click event listener to each element
        e.addEventListener('click', () => {
            // Call showMenu and pass the id of the clicked element
            showMenu(e.id);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener after the DOM is loaded
    document.getElementById('menu-dropdown').addEventListener('change', function () {
        showMenu(this.value);
    });
});



function parseCSV(csv) {
    const rows = [];
    let row = [], current = '', inQuotes = false;

    for (let i = 0; i < csv.length; i++) {
        const char = csv[i];
        const nextChar = csv[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            current += '"';
            i++; // Handle escaped quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++; // handle CRLF
            row.push(current);
            rows.push(row);
            row = [];
            current = '';
        } else {
            current += char;
        }
    }

    // Push the last value (if not already added)
    if (current !== '' || row.length > 0) {
        row.push(current);
        rows.push(row);
    }

    return rows;
}

function showMenu(chosen) {
    document.getElementById('special-menu').style.display = "none";
    if (chosen === "Special Meal") {
        document.getElementById('special-menu').style.display = "grid";
    }

    let csvText = document.getElementById('csv-data').value.trim();
    let rows = parseCSV(csvText);
    if (rows.length < 2) return;

    let headers = rows[0].map(h => h.trim());
    let data = rows.slice(1).map(values => {
        let item = {};
        headers.forEach((h, i) => item[h] = values[i]?.trim() || "");
        return item;
    });

    let container = document.getElementById('menu-display');
    container.innerHTML = '';


    data.forEach(item => {
        if (item.type === chosen) {
            let card = document.createElement('div');

            // Parse and format price, handle empty or invalid price
            let priceNum = parseFloat(item.price);
            let formattedPrice = isNaN(priceNum)
                ? ""
                : new Intl.NumberFormat('en-GB', {
                    style: 'currency',
                    currency: 'GBP',
                }).format(priceNum);

            card.innerHTML = `
            <div class="item">
                <div class="name">${item.name || "Unnamed Item"}</div>
                <div class="price">${formattedPrice}</div>
            </div>
            `;
            container.appendChild(card);
        }
    });
}



document.addEventListener("DOMContentLoaded", function () {
    // Get all modal links
    let modalLinks = document.querySelectorAll('.footer-link');

    // Loop through all modal links and add event listeners
    modalLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            let modalId = link.getAttribute('data-modal'); // Get the modal ID from the link
            let modal = document.getElementById(modalId); // Find the corresponding modal
            modal.style.display = "block"; // Show the modal
            document.body.style.overflow = "hidden"; // prevent background scroll
        });
    });

    // Get all close buttons inside modals
    let closeButtons = document.querySelectorAll('.close');

    // Loop through close buttons and add event listeners
    closeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            let modal = button.closest('.modal'); // Get the closest modal element
            modal.style.display = "none"; // Hide the modal
            document.body.style.overflow = ""; // restore background scroll
        });
    });

    // Close the modal when clicking outside of it
    window.addEventListener('click', function (event) {
        let modals = document.querySelectorAll('.modal');
        modals.forEach(function (modal) {
            if (event.target === modal) {
                modal.style.display = "none"; // Close modal if clicked outside
                document.body.style.overflow = ""; // restore background scroll
            }
        });
    });
});

function handleResize() {
    const tooSmall = window.innerWidth < 170;

    if (tooSmall && !document.body.classList.contains("too-small")) {
        // Save original content only once
        originalContent = document.body.innerHTML;

        // Replace with warning
        document.body.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif; text-align: center;">
          <p style="font-size: 14px; color: #333;">
            Your screen is too small to properly display this website.
            <br><br>
            Please rotate your device or use a larger screen.
          </p>
        </div>
      `;
        document.body.classList.add("too-small");
        document.body.style.overflow = "hidden";
    } else if (!tooSmall && document.body.classList.contains("too-small")) {
        // Restore original content
        document.body.innerHTML = originalContent;
        document.body.classList.remove("too-small");
        document.body.style.overflow = "";
    }
}

// Run once on load
window.addEventListener("DOMContentLoaded", handleResize);

// Run on resize
window.addEventListener("resize", handleResize);