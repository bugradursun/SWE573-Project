package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.service.BoardService;
import com.bugradursun.connectthedots.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/api/contributions")
@RequiredArgsConstructor
public class ContributionController {
    private final UserService userService;
    private final BoardService boardService;

    @PostMapping("/add")
    public ResponseEntity<String> addContribution(
            @RequestParam UUID boardId,
            @RequestParam String content,
            Authentication authentication
    ) {
        var user = userService.getByUsername(authentication.getName());
        var board = boardService.getBoardById(boardId);

        UUID contributionId = UUID.randomUUID();

        if(user.getContributions() == null) {
            user.setContributions(new ArrayList<>());
        }
        user.getContributions().add(contributionId.toString());

        userService.save(user);
        return ResponseEntity.ok("Contribution added to user");
    }
}
