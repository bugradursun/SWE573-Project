package com.example.ConnectTheDotsApi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ConnectTheDotsApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConnectTheDotsApiApplication.class, args);
	}

}
