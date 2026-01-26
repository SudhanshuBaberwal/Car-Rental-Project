import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


export const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name : "dywvhoblc",
        api_key : "451157845496466",
        api_secret : "Bhxj4tQeTH8_9757nhQT8OUroxo"
    })
    try {
        const uploadImage = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return uploadImage.secure_url;
        
    } catch (error) {
        console.log("Error in uploadCloudinary Function" , error)
    }
}
