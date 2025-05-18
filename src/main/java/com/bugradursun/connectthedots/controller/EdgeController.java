package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.dto.EdgeDto;
import com.bugradursun.connectthedots.entity.Edge;
import com.bugradursun.connectthedots.service.EdgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

//create edges
//get edges by board
@RestController
@RequestMapping("/api/edges")
@RequiredArgsConstructor
public class EdgeController {
    private final EdgeService edgeService;

    @PostMapping("/create")
    public ResponseEntity<EdgeDto> createEdge(@RequestBody EdgeDto edgeDto) {
        EdgeDto created = edgeService.createEdge(edgeDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/edge/{boardId}")
    public ResponseEntity<List<EdgeDto>> getEdgesByBoard(@PathVariable UUID boardId) {
        List<EdgeDto> edges = edgeService.getEdgesByBoardId(boardId);
        return ResponseEntity.ok(edges);
    }

}
