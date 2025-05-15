package com.bugradursun.connectthedots.repository;

import com.bugradursun.connectthedots.entity.Node;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NodeRepository extends JpaRepository<Node, UUID> {
    List<Node> findByBoardId(UUID boardId);
}
