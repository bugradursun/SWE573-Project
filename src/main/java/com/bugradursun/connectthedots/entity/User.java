package com.bugradursun.connectthedots.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="users")
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) // createdDate,updatedDate gibi tarihleri takip etmek icin
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false,unique = true)
    private String username;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable=false)
    private String age;

    @Column(nullable = false)
    private String profession;

    @Column(name="created_at",nullable = false,updatable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name ="updated_at")
    @LastModifiedDate
    private Instant updatedAt;


}
