package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.entity.Contribution;
import com.bugradursun.connectthedots.repository.BoardRepository;
import com.bugradursun.connectthedots.repository.ContributionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContributionService {

    private final ContributionRepository contributionRepository;
    private final BoardRepository boardRepository;

    public Contribution addContribution(UUID boardId,String content, UUID parentId, String createdBy) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
        Contribution contribution = new Contribution();
        contribution.setContent(content);
        contribution.setBoard(board);
        contribution.setCreatedBy(createdBy);
        contribution.setCreatedAt(Instant.now());

        if(parentId!= null) {
            Contribution parent = contributionRepository.findById(boardId)
                    .orElseThrow(() -> new RuntimeException("Parent contribution not found"));
            contribution.setParent(parent);
        }
        return contributionRepository.save(contribution);

    }
    public List<Contribution> getContributionsByBoard(UUID boardId) {
        return contributionRepository.findByBoardId(boardId);
    }
}
