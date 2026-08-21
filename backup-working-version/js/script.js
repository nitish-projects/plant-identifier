// ================================
// Get HTML Elements
// ================================

const themeToggle = document.getElementById("themeToggle");

const plantImage = document.getElementById("plantImage");
const uploadArea = document.getElementById("uploadArea");

const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");

const removeImage = document.getElementById("removeImage");
const identifyButton = document.getElementById("identifyButton");

const resultSection = document.getElementById("result");
const resultImage = document.getElementById("resultImage");


// ================================
// Dark Mode
// ================================

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {

            themeToggle.textContent = "☀️";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light mode"
            );

        } else {

            themeToggle.textContent = "🌙";

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark mode"
            );
        }
    });
}


// ================================
// Select Image
// ================================

if (plantImage) {

    plantImage.addEventListener("change", () => {

        const file = plantImage.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            plantImage.value = "";

            return;
        }

        showImage(file);
    });
}


// ================================
// Show Image Preview
// ================================

function showImage(file) {

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    imagePreview.hidden = false;

    identifyButton.disabled = false;
}


// ================================
// Remove Selected Image
// ================================

if (removeImage) {

    removeImage.addEventListener("click", () => {

        plantImage.value = "";

        previewImage.src = "";

        imagePreview.hidden = true;

        identifyButton.disabled = true;

        resultSection.hidden = true;
    });
}


// ================================
// Drag and Drop
// ================================

if (uploadArea) {

    uploadArea.addEventListener("dragover", (event) => {

        event.preventDefault();

        uploadArea.classList.add("drag-over");
    });


    uploadArea.addEventListener("dragleave", () => {

        uploadArea.classList.remove("drag-over");
    });


    uploadArea.addEventListener("drop", (event) => {

        event.preventDefault();

        uploadArea.classList.remove("drag-over");

        const file = event.dataTransfer.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please upload an image file.");

            return;
        }

        try {

            const dataTransfer = new DataTransfer();

            dataTransfer.items.add(file);

            plantImage.files = dataTransfer.files;

        } catch (error) {

            console.warn(
                "Could not assign dropped file:",
                error
            );
        }

        showImage(file);
    });
}


// ================================
// Identify Plant
// ================================

if (identifyButton) {

    identifyButton.addEventListener(
        "click",
        async () => {

            const file = plantImage.files[0];

            if (!file) {

                alert(
                    "Please select an image first."
                );

                return;
            }


            // Disable button while processing

            identifyButton.disabled = true;

            identifyButton.textContent =
                "Identifying... 🌱";


            try {

                // ========================================
                // Send image to Node.js backend
                // ========================================

                const formData = new FormData();

                formData.append(
                    "image",
                    file
                );


                const response = await fetch(
                    "http://localhost:3000/api/identify",
                    {
                        method: "POST",
                        body: formData
                    }
                );


                // ========================================
                // Read Pl@ntNet response
                // ========================================

                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Plant identification failed."
                    );
                }


                console.log(
                    "Pl@ntNet response:",
                    data
                );


                // ========================================
                // Show result section
                // ========================================

                resultSection.hidden = false;


                // Show uploaded image

                resultImage.src =
                    URL.createObjectURL(file);


                // ========================================
                // Get best plant result
                // ========================================

                const bestResult =
                    data.results?.[0];


                if (!bestResult) {

                    throw new Error(
                        "No plant result was returned."
                    );
                }


                // ========================================
                // Confidence
                // ========================================

                const confidence =
                    Math.round(
                        bestResult.score * 100
                    );


                // ========================================
                // Species information
                // ========================================

                const species =
                    bestResult.species || {};


                // Scientific name

                const scientificName =
                    species.scientificName ||
                    "Scientific name unavailable";


                // Common names

                const commonNames =
                    species.commonNames || [];


                const mainCommonName =
                    commonNames.length > 0
                        ? commonNames[0]
                        : "Unknown plant";


                // Family

                const family =
                    species.family?.scientificName ||
                    "Family information unavailable";


                // Genus

                const genus =
                    species.genus?.scientificName ||
                    "Genus information unavailable";


                // ========================================
                // Get information from GBIF
                // ========================================

                const gbifResponse =
                    await fetch(
                        `http://localhost:3000/api/plant-info?name=${encodeURIComponent(scientificName)}`
                    );


                const gbifData =
                    await gbifResponse.json();


                console.log(
                    "GBIF response:",
                    gbifData
                );


                // ========================================
                // GBIF information
                // ========================================

                const gbifFamily =
                    gbifData.family ||
                    family;


                const gbifGenus =
                    gbifData.genus ||
                    genus;


                const gbifOrder =
                    gbifData.order ||
                    "Not available";


                const gbifKingdom =
                    gbifData.kingdom ||
                    "Not available";


                const gbifStatus =
    gbifData.taxonomicStatus ||
    "ACCEPTED";


                const gbifScientificName =
                    gbifData.scientificName ||
                    scientificName;


                const gbifClass =
                    gbifData.class ||
                    "Not available";


                // ========================================
                // Display Plant Name
                // ========================================

                const plantNameElement =
                    document.getElementById(
                        "plantName"
                    );


                if (plantNameElement) {

                    plantNameElement.textContent =
                        mainCommonName;
                }


                // ========================================
                // Display Scientific Name
                // ========================================

                const scientificNameElement =
                    document.getElementById(
                        "scientificName"
                    );


                if (scientificNameElement) {

                    scientificNameElement.textContent =
                        gbifScientificName;
                }


                // ========================================
                // Display Confidence
                // ========================================

                const confidenceElement =
                    document.getElementById(
                        "confidence"
                    );


                if (confidenceElement) {

                    confidenceElement.textContent =
                        confidence + "%";
                }


                // ========================================
                // Display Family
                // ========================================

                const familyElement =
                    document.getElementById(
                        "plantFamily"
                    );


                if (familyElement) {

                    familyElement.textContent =
                        gbifFamily;
                }


                // ========================================
                // Display Plant Information
                // ========================================

    // ========================================
// Display Plant Information
// ========================================

const descriptionElement =
    document.getElementById("plantDescription");

if (descriptionElement) {

    descriptionElement.innerHTML = `

        <div class="info-row">
            <span>🌿 Common Name</span>
            <span class="info-arrow">→</span>
            <strong>${mainCommonName}</strong>
        </div>

        <div class="info-row">
            <span>🔬 Scientific Name</span>
            <span class="info-arrow">→</span>
            <strong>${gbifScientificName}</strong>
        </div>

        <div class="info-row">
            <span>🌱 Genus</span>
            <span class="info-arrow">→</span>
            <strong>${gbifGenus}</strong>
        </div>

        <div class="info-row">
            <span>🌸 Order</span>
            <span class="info-arrow">→</span>
            <strong>${gbifOrder}</strong>
        </div>

        <div class="info-row">
            <span>🍃 Class</span>
            <span class="info-arrow">→</span>
            <strong>${gbifClass}</strong>
        </div>

        <div class="info-row">
            <span>🌍 Kingdom</span>
            <span class="info-arrow">→</span>
            <strong>${gbifKingdom}</strong>
        </div>

        <div class="info-row">
            <span>✅ Taxonomic Status</span>
            <span class="info-arrow">→</span>
            <strong>${gbifStatus}</strong>
        </div>

    `;
}

                // ========================================
                // Scroll to Result
                // ========================================

                resultSection.scrollIntoView({
                    behavior: "smooth"
                });


            } catch (error) {

                // ========================================
                // Error Handling
                // ========================================

                console.error(
                    "Identification error:",
                    error
                );


                alert(
                    "Unable to identify the plant. Please try again."
                );


            } finally {

                // ========================================
                // Restore Button
                // ========================================

                identifyButton.disabled = false;

                identifyButton.textContent =
                    "Identify Plant 🌱";
            }
        }
    );
}