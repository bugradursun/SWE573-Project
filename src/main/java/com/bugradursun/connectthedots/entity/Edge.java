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
@Table(name="edges")
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Edge {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_node_id",nullable = false)
    private Node source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="target_node_id",nullable = false)
    private Node target;

    @Column
    private String title;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name ="board_id",nullable = false)
    private Board board;

    @Column(nullable = false)
    private String createdBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
