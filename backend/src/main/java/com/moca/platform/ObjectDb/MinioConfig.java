package com.moca.platform.ObjectDb;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "minio.enabled", havingValue = "true")
public class MinioConfig {

    private static final Logger log = LoggerFactory.getLogger(MinioConfig.class);

    @Bean
    MinioClient minioClient(MinioProperties props) {
        return MinioClient.builder()
                .endpoint(props.getEndpoint())
                .credentials(props.getAccessKey(), props.getSecretKey())
                .build();
    }

    @Bean
    ObjectStorageService objectStorageService(MinioClient minioClient, MinioProperties props) {
        ensureBucket(minioClient, props);
        return new ObjectStorageService(minioClient, props);
    }

    private static void ensureBucket(MinioClient client, MinioProperties props) {
        String bucket = props.getBucket();
        try {
            boolean exists = client.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
            if (exists) {
                log.info("MinIO bucket '{}' ready at {}", bucket, props.getEndpoint());
                return;
            }
            if (props.isAutoCreateBucket()) {
                client.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                log.info("Created MinIO bucket '{}' at {}", bucket, props.getEndpoint());
                return;
            }
            throw new IllegalStateException(
                    "MinIO bucket '" + bucket + "' not found at " + props.getEndpoint()
                            + ". Create it in the console or set MINIO_AUTO_CREATE_BUCKET=true");
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Cannot reach MinIO at " + props.getEndpoint()
                            + " (remote server — check VPN, firewall, credentials)",
                    e);
        }
    }
}
