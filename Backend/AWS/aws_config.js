// import { S3Client } from "@aws-sdk/client-s3";

// const awsConfig = {
//   credentials: {
//     accessKeyId: "AKIAQEIP3HSUQT3HTPPM",
//     secretAccessKey: "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",
//   },
//   region: "eu-north-1",
// };

// const s3Client = new S3Client(awsConfig);

// export default s3Client;

import { S3Client } from "@aws-sdk/client-s3";

const awsConfig = {
  credentials: {
    accessKeyId: "AKIAQEIP3HSUQT3HTPPM",
    secretAccessKey: "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",
  },
  region: "eu-north-1",
};

const s3Client = new S3Client(awsConfig);

export default s3Client;

