const http = require('http');
const IBM = require('ibm-cos-sdk');

const PORT = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end(JSON.stringify(process.env, null, 2));
// });





// COS configuration using env vars
const config = {
  endpoint: process.env.COS_ENDPOINT,
  apiKeyId: process.env.COS_API_KEY_ID,
  ibmAuthEndpoint: 'https://iam.cloud.ibm.com/identity/token',
  serviceInstanceId: process.env.COS_RESOURCE_INSTANCE_ID,
};

const cos = new IBM.S3(config);

async function readFromCOS(bucketName, objectKey) {
  try {
    const data = await cos.getObject({
      Bucket: bucketName,
      Key: objectKey,
    }).promise();

    // Return file content as string
    return data.Body.toString('utf-8');
  } catch (err) {
    console.error('❌ Error downloading from COS:', err);
    throw err;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    // Replace these with your actual bucket and file path or read from req.url if you want dynamic behavior
    const bucketName = 'bucket-absaq3cu5ztx0x8';
    const objectKey = 'test.txt';

    const fileContent = await readFromCOS(bucketName, objectKey);

    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      env: {
        COS_ENDPOINT: process.env.COS_ENDPOINT,
        COS_API_KEY_ID: process.env.COS_API_KEY_ID ? '***hidden***' : undefined,
        COS_RESOURCE_INSTANCE_ID: process.env.COS_RESOURCE_INSTANCE_ID,
      },
      fileContent,
    }, null, 2));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({
      success: false,
      message: 'Error fetching file from COS',
      error: error.message,
    }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
