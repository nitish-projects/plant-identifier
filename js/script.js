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

const loadingMessage = document.getElementById("loadingMessage");

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
            loadingMessage.hidden = false;
            loadingMessage.hidden = true;

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
                    "https://plant-identifier-np5i.onrender.com/api/identify" ,
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
// Display Plant Details
// ========================================

const detailCommonName =
    document.getElementById("detailCommonName");

const detailGenus =
    document.getElementById("detailGenus");

const detailFamily =
    document.getElementById("detailFamily");

const detailKingdom =
    document.getElementById("detailKingdom");


if (detailCommonName) {
    detailCommonName.textContent =
        mainCommonName;
}

if (detailGenus) {
    detailGenus.textContent =
        gbifGenus;
}

if (detailFamily) {
    detailFamily.textContent =
        gbifFamily;
}

if (detailKingdom) {
    detailKingdom.textContent =
        gbifKingdom;
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

// ========================================
// Identify Another Plant
// ========================================

const anotherPlantButton =
    document.getElementById("anotherPlantButton");
    

if (anotherPlantButton) {

    anotherPlantButton.addEventListener("click", () => {
       

        // Clear selected image
        plantImage.value = "";

        // Clear preview
        previewImage.src = "";
        imagePreview.hidden = true;

        // Hide result
        resultSection.hidden = true;

        // Disable identify button
        identifyButton.disabled = true;

        // Scroll back to upload section
        document.getElementById("identifier").scrollIntoView({
            behavior: "smooth"
        });

    });

}

// ========================================
// Download Plant Result as PDF
// ========================================

const downloadResultButton =
    document.getElementById("downloadResultButton");

if (downloadResultButton) {

    downloadResultButton.addEventListener("click", () => {

        const plantName =
            document.getElementById("plantName")?.textContent.trim() ||
            "Plant";

        const scientificName =
            document.getElementById("scientificName")?.textContent.trim() ||
            "Not available";

        const confidence =
            document.getElementById("confidence")?.textContent.trim() ||
            "Not available";

        const family =
            document.getElementById("plantFamily")?.textContent.trim() ||
            "Not available";

        const infoRows =
            document.querySelectorAll("#plantDescription .info-row");

        const details = {};

        infoRows.forEach(row => {

            const label =
                row.querySelector("span")?.textContent.trim();

            const value =
                row.querySelector("strong")?.textContent.trim();

            if (label && value) {
                details[label] = value;
            }
        });

        if (!window.jspdf) {
            alert("PDF library could not be loaded.");
            return;
        }

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF();

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        pdf.setFontSize(22);
        pdf.setFont("helvetica", "bold");

        pdf.text(
            "Plant Identification Report",
            20,
            25
        );

        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");

        pdf.text(
            "Generated by Plant Identifier",
            20,
            33
        );

        pdf.setDrawColor(79, 143, 91);

        pdf.line(
            20,
            40,
            pageWidth - 20,
            40
        );

        pdf.setFontSize(18);
        pdf.setFont("helvetica", "bold");

        pdf.text(
            plantName,
            20,
            55
        );

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "italic");

        pdf.text(
            scientificName,
            20,
            64
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);

        pdf.text(
            "Identification Details",
            20,
            82
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);

        pdf.text(
            `Confidence: ${confidence}`,
            25,
            94
        );

        pdf.text(
            `Family: ${family}`,
            25,
            103
        );

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);

        pdf.text(
            "Plant Information",
            20,
            122
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);

        let y = 135;

        Object.entries(details).forEach(([label, value]) => {

            const cleanLabel =
                label.replace(/^[^\w]+/, "").trim();

            pdf.setFont("helvetica", "bold");

            pdf.text(
                `${cleanLabel}:`,
                25,
                y
            );

            pdf.setFont("helvetica", "normal");

            const valueLines =
                pdf.splitTextToSize(
                    value,
                    pageWidth - 85
                );

            pdf.text(
                valueLines,
                75,
                y
            );

            y += Math.max(
                9,
                valueLines.length * 6
            );

            if (y > 270) {

                pdf.addPage();

                y = 25;
            }
        });

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        pdf.setFontSize(9);
        pdf.setTextColor(100);

        pdf.text(
            "Plant Identifier • Identification Report",
            20,
            pageHeight - 15
        );

        const safeName =
            plantName
                .replace(/[^a-z0-9]/gi, "_")
                .replace(/_+/g, "_");

        pdf.save(
            `${safeName}_plant_report.pdf`
        );

    });
}

