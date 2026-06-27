package com.moca.platform.CacheLayer;

import java.time.Duration;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisCacheService {

    private final Optional<StringRedisTemplate> redis;

    public RedisCacheService(@Autowired(required = false) StringRedisTemplate redis) {
        this.redis = Optional.ofNullable(redis);
    }

    public boolean isAvailable() {
        return redis.isPresent();
    }

    public void ping() {
        StringRedisTemplate template = redis.orElseThrow(
                () -> new IllegalStateException("Redis is disabled"));
        template.opsForValue().set("moca:health:ping", "pong", Duration.ofSeconds(30));
    }

    public Optional<String> get(String key) {
        if (redis.isEmpty()) {
            return Optional.empty();
        }
        return Optional.ofNullable(redis.get().opsForValue().get(key));
    }

    public void set(String key, String value, Duration ttl) {
        if (redis.isEmpty()) {
            return;
        }
        redis.get().opsForValue().set(key, value, ttl);
    }

    public void delete(String key) {
        if (redis.isPresent()) {
            redis.get().delete(key);
        }
    }
}
