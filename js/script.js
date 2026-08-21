// ========================================
// PLANT IDENTIFIER - FRONTEND JAVASCRIPT
// ========================================

// ========================================
// Backend Configuration
// ========================================

const API_BASE_URL =
    "https://plant-identifier-np5i.onrender.com";


// ========================================
// Get HTML Elements
// ========================================

const themeToggle =
    document.getElementById("themeToggle");

const plantImage =
    document.getElementById("plantImage");

const uploadArea =
    document.getElementById("uploadArea");

const imagePreview =
    document.getElementById("imagePreview");

const previewImage =
    document.getElementById("previewImage");

const removeImage =
    document.getElementById("removeImage");

const identifyButton =
    document.getElementById("identifyButton");

const resultSection =
    document.getElementById("result");

const resultImage =
    document.getElementById("resultImage");

const loadingMessage =
    document.getElementById("loadingMessage");


// ========================================
// Dark Mode
// ========================================

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const darkMode =
            document.body.classList.contains("dark-mode");

        if (darkMode) {

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


// ========================================
// Select Image
// ========================================

if (plantImage) {

    plantImage.addEventListener("change", () => {

        const file =
            plantImage.files[0];

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


// ========================================
// Show Image Preview
// ========================================

function showImage(file) {

    const imageURL =
        URL.createObjectURL(file);

    previewImage.src =
        imageURL;

    imagePreview.hidden =
        false;

    identifyButton.disabled =
        false;

    // Hide previous result
    resultSection.hidden =
        true;
}


// ========================================
// Remove Selected Image
// ========================================

if (removeImage) {

    removeImage.addEventListener("click", () => {

        plantImage.value = "";

        previewImage.src = "";

        imagePreview.hidden = true;

        identifyButton.disabled = true;

        resultSection.hidden = true;
    });
}


// ========================================
// Drag and Drop
// ========================================

if (uploadArea) {

    uploadArea.addEventListener(
        "dragover",
        (event) => {

            event.preventDefault();

            uploadArea.classList.add(
                "drag-over"
            );
        }
    );


    uploadArea.addEventListener(
        "dragleave",
        () => {

            uploadArea.classList.remove(
                "drag-over"
            );
        }
    );


    uploadArea.addEventListener(
        "drop",
        (event) => {

            event.preventDefault();

            uploadArea.classList.remove(
                "drag-over"
            );

            const file =
                event.dataTransfer.files[0];

            if (!file) {
                return;
            }

            if (!file.type.startsWith("image/")) {

                alert(
                    "Please upload an image file."
                );

                return;
            }

            try {

                const dataTransfer =
                    new DataTransfer();

                dataTransfer.items.add(file);

                plantImage.files =
                    dataTransfer.files;

            } catch (error) {

                console.warn(
                    "Could not assign dropped file:",
                    error
                );
            }

            showImage(file);
        }
    );
}


// ========================================
// Identify Plant
// ========================================

if (identifyButton) {

    identifyButton.addEventListener(
        "click",
        async () => {

            const file =
                plantImage.files[0];

            if (!file) {

                alert(
                    "Please select an image first."
                );

                return;
            }


            // ========================================
            // Start Loading
            // ========================================

            if (loadingMessage) {
                loadingMessage.hidden = false;
            }

            identifyButton.disabled = true;

            identifyButton.textContent =
                "Identifying... 🌱";


            try {

                // ========================================
                // Create FormData
                // ========================================

                const formData =
                    new FormData();

                formData.append(
                    "image",
                    file
                );


                // ========================================
                // Send Image to Backend
                // ========================================

                console.log(
                    "Sending image to backend..."
                );


                const response =
                    await fetch(
                        `${API_BASE_URL}/api/identify`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                // ========================================
                // Read Response
                // ========================================

                const data =
                    await response.json();


                console.log(
                    "Backend response:",
                    data
                );


                // ========================================
                // Handle Backend Error
                // ========================================

                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Plant identification failed."
                    );
                }


                // ========================================
                // Get Best Plant Result
                // ========================================

                const bestResult =
                    data.results?.[0];


                if (!bestResult) {

                    throw new Error(
                        "No plant result was returned by Pl@ntNet."
                    );
                }


                // ========================================
                // Confidence
                // ========================================

                const confidence =
                    Math.round(
                        (bestResult.score || 0) * 100
                    );


                // ========================================
                // Species
                // ========================================

                const species =
                    bestResult.species || {};


                // ========================================
                // Common Name
                // ========================================

                const commonNames =
                    Array.isArray(
                        species.commonNames
                    )
                        ? species.commonNames
                        : [];


                const mainCommonName =
                    commonNames.length > 0
                        ? commonNames[0]
                        : (
                            species.scientificNameWithoutAuthor ||
                            species.scientificName ||
                            "Unknown plant"
                        );


                // ========================================
                // Scientific Name
                // ========================================

                const scientificName =
                    species.scientificName ||
                    species.scientificNameWithoutAuthor ||
                    "Scientific name unavailable";


                // ========================================
                // Family
                // ========================================

                const family =
                    species.family?.scientificName ||
                    "Not available";


                // ========================================
                // Genus
                // ========================================

                const genus =
                    species.genus?.scientificName ||
                    "Not available";


                // ========================================
                // Get GBIF Information
                // ========================================

                let gbifData = {};


                try {

                    console.log(
                        "Requesting GBIF information..."
                    );


                    const gbifResponse =
                        await fetch(
                            `${API_BASE_URL}/api/plant-info?name=${encodeURIComponent(scientificName)}`
                        );


                    if (gbifResponse.ok) {

                        gbifData =
                            await gbifResponse.json();

                        console.log(
                            "GBIF response:",
                            gbifData
                        );

                    } else {

                        console.warn(
                            "GBIF request failed."
                        );
                    }

                } catch (gbifError) {

                    console.warn(
                        "GBIF unavailable:",
                        gbifError
                    );

                    // Continue using Pl@ntNet information.
                }


                // ========================================
                // Final Plant Information
                // ========================================

                const finalScientificName =
                    gbifData.scientificName ||
                    scientificName;


                const finalFamily =
                    gbifData.family ||
                    family ||
                    "Not available";


                const finalGenus =
                    gbifData.genus ||
                    genus ||
                    "Not available";


                const finalOrder =
                    gbifData.order ||
                    "Not available";


                const finalClass =
                    gbifData.class ||
                    "Not available";


                const finalKingdom =
                    gbifData.kingdom ||
                    "Plantae";


                const finalStatus =
                    gbifData.taxonomicStatus ||
                    "Accepted";


                // ========================================
                // Show Result Section
                // ========================================

                resultSection.hidden =
                    false;


                // ========================================
                // Show Uploaded Image
                // ========================================

                resultImage.src =
                    URL.createObjectURL(file);


                // ========================================
                // Plant Name
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
                // Scientific Name
                // ========================================

                const scientificNameElement =
                    document.getElementById(
                        "scientificName"
                    );


                if (scientificNameElement) {

                    scientificNameElement.textContent =
                        finalScientificName;
                }


                // ========================================
                // Confidence
                // ========================================

                const confidenceElement =
                    document.getElementById(
                        "confidence"
                    );


                if (confidenceElement) {

                    confidenceElement.textContent =
                        `${confidence}%`;
                }


                // ========================================
                // Family
                // ========================================

                const familyElement =
                    document.getElementById(
                        "plantFamily"
                    );


                if (familyElement) {

                    familyElement.textContent =
                        finalFamily;
                }


                // ========================================
                // Plant Information
                // ========================================

                const descriptionElement =
                    document.getElementById(
                        "plantDescription"
                    );


                if (descriptionElement) {

                    descriptionElement.innerHTML = `

                        <div class="info-row">

                            <span>
                                🌿 Common Name
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(mainCommonName)}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                🔬 Scientific Name
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(finalScientificName)}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                🌱 Genus
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(finalGenus)}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                🌸 Order
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(finalOrder)}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                🍃 Class
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(finalClass)}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                🌍 Kingdom
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(finalKingdom)}
                            </strong>

                        </div>


                        <div class="info-row">

                            <span>
                                ✅ Taxonomic Status
                            </span>

                            <span class="info-arrow">
                                →
                            </span>

                            <strong>
                                ${escapeHTML(finalStatus)}
                            </strong>

                        </div>

                    `;
                }


                // ========================================
                // Plant Details Cards
                // ========================================

                const detailCommonName =
                    document.getElementById(
                        "detailCommonName"
                    );

                const detailGenus =
                    document.getElementById(
                        "detailGenus"
                    );

                const detailFamily =
                    document.getElementById(
                        "detailFamily"
                    );

                const detailKingdom =
                    document.getElementById(
                        "detailKingdom"
                    );


                if (detailCommonName) {

                    detailCommonName.textContent =
                        mainCommonName;
                }


                if (detailGenus) {

                    detailGenus.textContent =
                        finalGenus;
                }


                if (detailFamily) {

                    detailFamily.textContent =
                        finalFamily;
                }


                if (detailKingdom) {

                    detailKingdom.textContent =
                        finalKingdom;
                }


                // ========================================
                // Scroll to Result
                // ========================================

                resultSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });


            } catch (error) {

                console.error(
                    "Identification error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to identify the plant. Please try again."
                );


            } finally {

                // ========================================
                // Stop Loading
                // ========================================

                if (loadingMessage) {
                    loadingMessage.hidden = true;
                }


                identifyButton.disabled =
                    false;


                identifyButton.textContent =
                    "Identify Plant 🌱";
            }

        }
    );
}


// ========================================
// HTML Escape Helper
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// Identify Another Plant
// ========================================

const anotherPlantButton =
    document.getElementById(
        "anotherPlantButton"
    );


if (anotherPlantButton) {

    anotherPlantButton.addEventListener(
        "click",
        () => {

            // Clear image
            plantImage.value = "";

            // Clear preview
            previewImage.src = "";

            imagePreview.hidden = true;

            // Hide result
            resultSection.hidden = true;

            // Disable identify button
            identifyButton.disabled = true;

            // Reset loading
            if (loadingMessage) {
                loadingMessage.hidden = true;
            }

            // Scroll to upload section
            const identifier =
                document.getElementById(
                    "identifier"
                );

            if (identifier) {

                identifier.scrollIntoView({
                    behavior: "smooth"
                });
            }
        }
    );
}


// ========================================
// Download Plant Result as PDF
// ========================================

const downloadResultButton =
    document.getElementById(
        "downloadResultButton"
    );


if (downloadResultButton) {

    downloadResultButton.addEventListener(
        "click",
        () => {

            const plantName =
                document
                    .getElementById("plantName")
                    ?.textContent
                    .trim() ||
                "Plant";


            const scientificName =
                document
                    .getElementById("scientificName")
                    ?.textContent
                    .trim() ||
                "Not available";


            const confidence =
                document
                    .getElementById("confidence")
                    ?.textContent
                    .trim() ||
                "Not available";


            const family =
                document
                    .getElementById("plantFamily")
                    ?.textContent
                    .trim() ||
                "Not available";


            const infoRows =
                document.querySelectorAll(
                    "#plantDescription .info-row"
                );


            const details = {};


            infoRows.forEach(row => {

                const spans =
                    row.querySelectorAll("span");

                const strong =
                    row.querySelector("strong");


                if (!strong) {
                    return;
                }


                let label = "";

                if (spans.length > 0) {

                    label =
                        spans[0]
                            .textContent
                            .trim();
                }


                const value =
                    strong.textContent.trim();


                if (label && value) {

                    details[label] =
                        value;
                }

            });


            // ========================================
            // Check jsPDF
            // ========================================

            if (!window.jspdf) {

                alert(
                    "PDF library could not be loaded."
                );

                return;
            }


            const { jsPDF } =
                window.jspdf;


            const pdf =
                new jsPDF();


            const pageWidth =
                pdf.internal.pageSize.getWidth();


            const pageHeight =
                pdf.internal.pageSize.getHeight();


            // ========================================
            // PDF Header
            // ========================================

            pdf.setFontSize(22);

            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.text(
                "Plant Identification Report",
                20,
                25
            );


            pdf.setFontSize(11);

            pdf.setFont(
                "helvetica",
                "normal"
            );


            pdf.text(
                "Generated by Plant Identifier",
                20,
                33
            );


            pdf.setDrawColor(
                79,
                143,
                91
            );


            pdf.line(
                20,
                40,
                pageWidth - 20,
                40
            );


            // ========================================
            // Plant Name
            // ========================================

            pdf.setFontSize(18);

            pdf.setFont(
                "helvetica",
                "bold"
            );


            pdf.text(
                plantName,
                20,
                55
            );


            pdf.setFontSize(12);

            pdf.setFont(
                "helvetica",
                "italic"
            );


            pdf.text(
                scientificName,
                20,
                64
            );


            // ========================================
            // Identification Details
            // ========================================

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(13);


            pdf.text(
                "Identification Details",
                20,
                82
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

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


            // ========================================
            // Plant Information
            // ========================================

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(13);


            pdf.text(
                "Plant Information",
                20,
                122
            );


            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(11);


            let y = 135;


            Object.entries(details)
                .forEach(
                    ([label, value]) => {

                        const cleanLabel =
                            label
                                .replace(
                                    /^[^\w]+/,
                                    ""
                                )
                                .trim();


                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );


                        pdf.text(
                            `${cleanLabel}:`,
                            25,
                            y
                        );


                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );


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

                    }
                );


            // ========================================
            // Footer
            // ========================================

            pdf.setFontSize(9);

            pdf.setTextColor(100);


            pdf.text(
                "Plant Identifier • Identification Report",
                20,
                pageHeight - 15
            );


            // ========================================
            // Save PDF
            // ========================================

            const safeName =
                plantName
                    .replace(
                        /[^a-z0-9]/gi,
                        "_"
                    )
                    .replace(
                        /_+/g,
                        "_"
                    );


            pdf.save(
                `${safeName}_plant_report.pdf`
            );

        }
    );
}