import dotenv from "dotenv";
// 👇 IMPORT THE APP FROM SRC
import app from "./src/app.js"; 

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 GSTGenie Backend running on port ${PORT}`);
  console.log(`📂 Uploads accessible at http://localhost:${PORT}/uploads`);
});