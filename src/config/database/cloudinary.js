import { v2 as cloudinary } from "cloudinary";

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_API_KEY || CLOUDINARY_API_SECRET) {
    console.log("error fetching cloudinary credintials");
    process.exit(1);
}
 
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS delivery URLs
});

export default cloudinary;