import s3Client from "../AWS/aws_config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Define your default image URL
const DEFAULT_IMAGE_URL = "https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko=";

export async function getImage(fileName) {
  try {
    // Check if AWS credentials are valid
    if (!s3Client || !s3Client.config.credentials) {
      console.warn("AWS S3 client is not properly configured or credentials are missing, using default image.");
      return { message: "Default", url: DEFAULT_IMAGE_URL };
    }

    const getObjectParams = {
      Bucket: "simply5", // Your bucket name
      Key: fileName,     // File key (filename)
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { message: "Success", url };

  } catch (error) {
    // console.error("Error getting image from S3:", error);
    // Return the default image URL if any error occurs
    return { message: "Error", url: DEFAULT_IMAGE_URL };
  }
}
