package com.moca.platform.CacheLayer;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SslOptions;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.util.StringUtils;

@Configuration
@ConditionalOnProperty(name = "redis.enabled", havingValue = "true")
public class RedisConfig {

    @Bean
    LettuceConnectionFactory redisConnectionFactory(RedisProperties props) {
        RedisStandaloneConfiguration standalone =
                new RedisStandaloneConfiguration(props.getHost(), props.getPort());
        if (StringUtils.hasText(props.getPassword())) {
            standalone.setPassword(props.getPassword());
        }

        LettuceClientConfiguration.LettuceClientConfigurationBuilder client =
                LettuceClientConfiguration.builder();
        if (props.isSsl()) {
            client.clientOptions(
                    ClientOptions.builder().sslOptions(SslOptions.create()).build());
            client.useSsl();
        }

        LettuceConnectionFactory factory =
                new LettuceConnectionFactory(standalone, client.build());
        factory.afterPropertiesSet();
        return factory;
    }

    @Bean
    StringRedisTemplate stringRedisTemplate(LettuceConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
