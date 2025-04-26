package com.bugradursun.connectthedots.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // this configuration enables JPA auditing for automatic timestamping
}
