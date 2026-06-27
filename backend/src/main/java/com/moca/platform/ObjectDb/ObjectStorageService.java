package com.moca.platform.ObjectDb;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import java.io.ByteArrayInputStream;
import java.time.Duration;

public class ObjectStorageService {

    private final MinioClient client;
    private final MinioProperties props;

    public ObjectStorageService(MinioClient client, MinioProperties props) {
        this.client = client;
        this.props = props;
    }

    public String bucket() {
        return props.getBucket();
    }

    public void putPng(String objectKey, byte[] pngBytes) {
        try {
            client.putObject(
                    PutObjectArgs.builder()
                            .bucket(props.getBucket())
                            .object(objectKey)
                            .stream(new ByteArrayInputStream(pngBytes), pngBytes.length, -1)
                            .contentType("image/png")
                            .build());
        } catch (Exception e) {
            throw new IllegalStateException("MinIO upload failed for " + objectKey, e);
        }
    }

    public byte[] getObject(String objectKey) {
        try {
            return client.getObject(
                            io.minio.GetObjectArgs.builder()
                                    .bucket(props.getBucket())
                                    .object(objectKey)
                                    .build())
                    .readAllBytes();
        } catch (Exception e) {
            throw new IllegalStateException("MinIO read failed for " + objectKey, e);
        }
    }

    public String presignedGetUrl(String objectKey, Duration ttl) {
        try {
            return client.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(props.getBucket())
                            .object(objectKey)
                            .expiry((int) ttl.toSeconds())
                            .build());
        } catch (Exception e) {
            throw new IllegalStateException("MinIO presign failed for " + objectKey, e);
        }
    }
}
