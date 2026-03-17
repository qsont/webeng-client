import app from "./app.js";
import { connect } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connect();

app.listen(PORT, ()=>{console.log(`HTTP Server running at ${PORT}...`)});