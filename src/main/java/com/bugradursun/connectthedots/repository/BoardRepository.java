package com.bugradursun.connectthedots.repository;

import com.bugradursun.connectthedots.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BoardRepository extends JpaRepository<Board, UUID> {

    Optional<Board> findByLabel(String label);
    boolean existsByLabel(String label);
    boolean existsByTitle(String title);
}
