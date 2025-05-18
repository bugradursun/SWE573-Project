package com.bugradursun.connectthedots.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="boards")
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class) // createdDate,updatedDate takip etmek icin
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false,unique = true)
    private String label;

    @Column(nullable = false,unique = true)
    private String title;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Node> nodes;

    @Column(nullable = false)
    private String content;

    @Column(nullable=false)
    private String createdBy;


    @Column(nullable = false)
    private String description;

    @Column(name="created_at",nullable = false,updatable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name ="updated_at")
    @LastModifiedDate
    private Instant updatedAt;


}
