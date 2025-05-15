package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.dto.BoardFlowDto;
import com.bugradursun.connectthedots.dto.NodeDto;
import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.entity.Contribution;
import com.bugradursun.connectthedots.entity.Node;
import com.bugradursun.connectthedots.service.BoardService;
import com.bugradursun.connectthedots.service.ContributionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
/*
@RestController
@RequestMapping("/api/board-flow") @RequiredArgsConstructor
public class BoardFlowController {
    private final BoardService boardService;
    private final ContributionService contributionService;

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardFlowDto> getBoardFlow(@PathVariable UUID boardId) {
        Board board = boardService.getBoardById(boardId);
        List<Node> contributions = contributionService.getContributionsByBoard(boardId);

        List<NodeDto> nodes = new ArrayList<>();
        List<EdgeDto> edges = new ArrayList<>();

        NodeDto boardNode = new NodeDto();
        boardNode.setId(board.getId().toString());
        boardNode.setType("board");
        boardNode.setData(Map.of("label", (Object) board.getTitle()));
        boardNode.setPosition(Map.of("x", 0, "y", 0));
        nodes.add(boardNode);

        for (int i = 0; i < contributions.size(); i++) {
            Contribution c = contributions.get(i);
            String nodeId = c.getId().toString();

            NodeDto contributionNode = new NodeDto();
            contributionNode.setId(nodeId);
            contributionNode.setType("contribution");
            contributionNode.setData(Map.of("label", c.getContent()));
            contributionNode.setPosition(Map.of("x", 200, "y", 100 + i * 120));

            EdgeDto edge = new EdgeDto();
            edge.setId("edge-" + i);
            edge.setSource(board.getId().toString());
            edge.setTarget(nodeId);
            edge.setType("smoothstep");

            nodes.add(contributionNode);
            edges.add(edge);
        }

        BoardFlowDto flowDto = new BoardFlowDto();
        flowDto.setNodes(nodes);
        flowDto.setEdges(edges);

        return ResponseEntity.ok(flowDto);



    }
}
