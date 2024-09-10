import { s3Client } from "../../../aws_config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteImage(imageName) {
  try {
    const params = {
      Bucket: "simply5",
      Key: imageName,
    };

    const command = new DeleteObjectCommand(params);

    const data = await s3Client.send(command);

    if (data) {
      return { message: "Success" };
    } else {
      return { message: "Unsuccess" };
    }
  } catch (error) {
    console.error("Error deleting:", error);
    throw new Error("Error deleting image from S3");
  }
}
