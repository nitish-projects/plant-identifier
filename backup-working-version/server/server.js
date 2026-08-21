const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = 3000;


// ================================
// Middleware
// ================================

app.use(cors());

app.use(express.json());


// ================================
// File Upload Configuration
// ================================

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});


// ================================
// Test Route
// ================================

app.get("/", (req, res) => {

    res.json({
        message: "Plant Identifier API is running 🌱"
    });

});


// ================================
// Plant Identification Route
// ================================

app.post(
    "/api/identify",
    upload.single("image"),
    async (req, res) => {

        try {

            // Check whether an image was uploaded

            if (!req.file) {

                return res.status(400).json({
                    error: "No image was uploaded."
                });

            }


            // Check whether the API key exists

            if (!process.env.PLANTNET_API_KEY) {

                return res.status(500).json({
                    error: "PlantNet API key is not configured."
                });

            }


            console.log(
                "Image received:",
                req.file.originalname
            );


            // ================================
            // Create FormData for Pl@ntNet
            // ================================

            const formData = new FormData();

            const imageBlob = new Blob(
                [req.file.buffer],
                {
                    type: req.file.mimetype
                }
            );


            formData.append(
                "images",
                imageBlob,
                req.file.originalname
            );


            formData.append(
                "organs",
                "auto"
            );


            // ================================
            // Send Image to Pl@ntNet
            // ================================

            const plantNetResponse = await fetch(
                "https://my-api.plantnet.org/v2/identify/all?api-key=" +
                encodeURIComponent(process.env.PLANTNET_API_KEY),
                {
                    method: "POST",

                    body: formData
                }
            );


            // ================================
            // Read API Response
            // ================================

            const data = await plantNetResponse.json();


            // ================================
            // Handle API Error
            // ================================

            if (!plantNetResponse.ok) {

                console.error("Pl@ntNet error:", data);

                return res.status(
                    plantNetResponse.status
                ).json({
                    error: "Plant identification failed.",
                    details: data
                });

            }


            // ================================
            // Send Result to Frontend
            // ================================

            res.json(data);

        } catch (error) {

            console.error("Server error:", error);

            res.status(500).json({
                error: "Something went wrong on the server."
            });

        }

    }
);


// ================================
// Start Server
// ================================

app.listen(PORT, () => {

    console.log(
        `Plant Identifier backend running at http://localhost:${PORT}`
    );

});

// ========================================
// GBIF Plant Information
// ========================================

app.get("/api/plant-info", async (req, res) => {

    try {

        const scientificName = req.query.name;

        if (!scientificName) {

            return res.status(400).json({
                error: "Scientific name is required."
            });

        }

        const response = await fetch(
            `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`
        );

        if (!response.ok) {

            throw new Error("GBIF request failed.");

        }

        const data = await response.json();

        console.log("GBIF response:", data);

        res.json(data);

    } catch (error) {

        console.error("GBIF error:", error);

        res.status(500).json({
            error: "Unable to get plant information."
        });

    }

});