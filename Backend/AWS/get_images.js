import s3Client from "../AWS/aws_config.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getImage(fileName) {
  try {
    const getObjectParams = {
      Bucket: "simply5",
      Key: fileName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return url;
  } catch (error) {
    console.error("Error getting:", error);
    throw new Error("Error getting file from S3");
  }
}
