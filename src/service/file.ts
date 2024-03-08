import OBSClient from "esdk-obs-browserjs";

const obsClient = new OBSClient({
  server: "http://obs.cn-east-3.myhuaweicloud.com/",
  access_key_id: "ECXZPB9CJNBSGKDVA5FC",
  secret_access_key: "yRStJuej4Cf71sLSYNxo6Hg0HPrjgrZe6G3i5Jt8",
})

export const uploadFileToOBS = async (file: File) => {
  const bucketName = 'obs-parrotcore';
  const objectKey = file.name;
  const res = await obsClient.putObject({
    Bucket: bucketName,
    Key: objectKey,
    SourceFile: file
  });
  console.log(res)
}