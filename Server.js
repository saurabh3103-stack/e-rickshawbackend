const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


require('dotenv').config();
const app = express();
app.use(cors()); // Allow requests from any origin
console.log("backend working successfully")
app.use(bodyParser.json());
app.use(express.json());
const router = express.Router();

const port = 3002;
const administration = require('./routes/administration');
const userRoutes= require('./routes/user')
const userPath = require('./routes/routes');
const appUser =  require('./routes/app_user');
const zone = require('./routes/zone');
const verifier = require('./routes/verifier');
const admin = require('./routes/admin');
const subAdmin = require('./routes/subAdmin');
const loginUser = require('./routes/loginUser');
const  QRCode = require("./routes/qrController");
const checVehicle = require('./routes/checkVehicleRoute');
// Vehicle Reg

const ownerRoutes = require('./routes/owner');
const vehicleRoutes = require('./routes/vehicle');
const vehicleDocumentRoutes = require('./routes/vehicleDocument');
const driverRoutes = require('./routes/driver');

// Vehicle Reg
const dbURI = 'mongodb+srv://sb652515:Shivanshu%4031@cluster0.x5946.mongodb.net/';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

  app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/administration', administration);
app.use('/api/users', userRoutes); 
app.use('/api/userPath', userPath);
app.use('/api/appUser',appUser);
app.use('/api/zones', zone);
app.use('/api/verifier',verifier);
app.use('/api/admin',admin);
app.use('/api/sub-admin',subAdmin);

app.use('/api/owner', ownerRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/vehicle-document', vehicleDocumentRoutes);
app.use('/api/driver', driverRoutes);
app.use("/api/qr_code", QRCode);
app.use("/api/checkVehicle",checVehicle);
// router.get("/api/get_qr/:uniqueId", getQR);

// Start Android app Routes

app.use('/api/otp',loginUser);

// End Android app Routes
app.use('/qrcodes', express.static(path.join(__dirname, 'qrcodes')));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
