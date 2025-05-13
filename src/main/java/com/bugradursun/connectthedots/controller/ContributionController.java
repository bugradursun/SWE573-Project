package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.dto.ContributionRequestDto;
import com.bugradursun.connectthedots.entity.Contribution;
import com.bugradursun.connectthedots.service.BoardService;
import com.bugradursun.connectthedots.service.ContributionService;
import com.bugradursun.connectthedots.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contributions")
@RequiredArgsConstructor
public class ContributionController {

    private final ContributionService contributionService;

    @PostMapping("/add")
    public ResponseEntity<Contribution> addContribution(@RequestBody ContributionRequestDto requestDto) {
        Contribution contribution = contributionService.addContribution(requestDto.boardId(), requestDto.content(),requestDto.parentId(),requestDto.createdBy());
        return ResponseEntity.ok(contribution);
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<Contribution>> getContributions(@PathVariable UUID boardId) {
        return ResponseEntity.ok(contributionService.getContributionsByBoard(boardId));
    }
}
