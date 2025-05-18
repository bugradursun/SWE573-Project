package com.bugradursun.connectthedots.repository;

import com.bugradursun.connectthedots.entity.Edge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EdgeRepository extends JpaRepository<Edge, UUID> {
    List<Edge> findByBoardId(UUID boardId);

}
