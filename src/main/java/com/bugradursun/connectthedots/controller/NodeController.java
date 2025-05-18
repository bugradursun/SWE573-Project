package com.bugradursun.connectthedots.controller;

// create nodes
// get nodes by board

import com.bugradursun.connectthedots.dto.NodeDto;
import com.bugradursun.connectthedots.service.NodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/nodes")
@RequiredArgsConstructor
public class NodeController {
    private final NodeService nodeService;

    @PostMapping("/create")
    public ResponseEntity<NodeDto> createNode(@RequestBody NodeDto nodeDto) {
        NodeDto created = nodeService.createNode(nodeDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<List<NodeDto>> getNodesByBoard(@PathVariable UUID boardId) {
        List<NodeDto> nodes = nodeService.getNodesByBoardId(boardId);
        return ResponseEntity.ok(nodes);

    }
}
