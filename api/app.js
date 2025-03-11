const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// app.use(cors());
app.use(cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "file-name"]
}));


// app.use((req, res, next) => {
//     res.setHeader("Cache-Control", "no-store");
//     next();
// });

const uploadDir = path.join(__dirname, "uploads");
if(!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// app.use(express.json({ limit: "50mb" })); 
// app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.post("/api/upload", (req, res) => {
    const extension = path.extname(req.headers["file-name"] || ".bin");
    const newFileName = `uploaded_${Date.now()}${extension}`;
    const filePath = path.join(uploadDir, newFileName);
    const writeStream = fs.createWriteStream(filePath);
    req.pipe(writeStream);
    writeStream.on("finish", () => {
        console.log("Renamed File:", newFileName);
        res.json({ message: "File uploaded and renamed!", filename: newFileName });
    });
    writeStream.on("error", (err) => {
        console.error("File Upload Error:", err);
        res.status(500).send("File upload failed.");
    });
});

app.get('/api', (req, res) => {
    console.log('api is ready');
    res.status(200).json({status: 'api is ready'});
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});