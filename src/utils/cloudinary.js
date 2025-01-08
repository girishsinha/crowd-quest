import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        await fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        await fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
const deleteFromCloudinary = async (cloudinaryFilepath) => {
    try {
        if (!cloudinaryFilepath) return null;
        const fileName = cloudinaryFilepath.split("/").pop().split(".")[0];
        const response = await cloudinary.uploader.destroy(fileName);
        return response;
    } catch (error) {
        console.log("Error while deleting file from cloudinary : ", error);
        return null;
    }
};


export { uploadOnCloudinary, deleteFromCloudinary }