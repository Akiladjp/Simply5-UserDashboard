import s3Client from "./aws_config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadImage(contentType, fileName, imagePath) {
  try {
    const params = {
      Bucket: "simply5",
      Key: fileName,
      Body: imagePath,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    if (data) {
      return { message: "Successfully uploaded" };
    } else {
      return { message: "Upload is unsuccessful" };
    }
  } catch (error) {
    console.error("Error uploading:", error);
    throw new Error("Error uploading file to S3");
  }
}
