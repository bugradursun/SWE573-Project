package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.entity.Contribution;
import com.bugradursun.connectthedots.repository.BoardRepository;
import com.bugradursun.connectthedots.repository.ContributionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContributionService {

    private final ContributionRepository contributionRepository;

    public List<Contribution> getContributionsByBoard(UUID boardId) {
        return contributionRepository.findByBoard_Id(boardId);
    }
}
