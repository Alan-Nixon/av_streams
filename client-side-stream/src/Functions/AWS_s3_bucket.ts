import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { generateName } from './streamFunctions/streamManagement';



const s3ClientConfig: S3ClientConfig = {
    region: 'eu-north-1',
    credentials: {
        accessKeyId: process.env.REACT_APP_AWSCLIENTID || "your acc id",
        secretAccessKey: process.env.REACT_APP_AWSCLIENTSECRET || "your secret okay"
    }
};



const s3Client = new S3Client(s3ClientConfig);


export const uploadToS3Bucket = async (data: File, onProgress: any) => {
    try {
        console.log("call vannu")
        const name = await generateName();
        console.log(name)
        const params = {
            Bucket: 'avstreams',
            Key: name || Date.now().toString(),
            Body: data
        };

        const upload = new Upload({
            client: s3Client,
            params,
            queueSize: 3,
            leavePartsOnError: false,
        });

        upload.on('httpUploadProgress', (progress: any) => {
            if (progress.total) {
                const percentage = Math.round((progress.loaded / progress.total) * 100);
                onProgress(percentage);
            }
        });

        await upload.done();

        const objectKey = params.Key;
        const region = 'eu-north-1';
        const url = `https://${params.Bucket}.s3.${region}.amazonaws.com/${objectKey}`;

        return url;
    } catch (err) {
        console.error('Error uploading video to S3:', err);
        throw err;
    }
};




