package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.dto.EdgeDto;
import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.entity.Edge;
import com.bugradursun.connectthedots.entity.Node;
import com.bugradursun.connectthedots.mapper.EdgeMapper;
import com.bugradursun.connectthedots.repository.BoardRepository;
import com.bugradursun.connectthedots.repository.EdgeRepository;
import com.bugradursun.connectthedots.repository.NodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EdgeService {

    private final EdgeRepository edgeRepository;
    private final BoardRepository boardRepository;
    private final NodeRepository nodeRepository;

    public EdgeDto createEdge(EdgeDto dto) {
        Board board = boardRepository.findById(dto.boardId())
                .orElseThrow(() -> new RuntimeException("Board not found"));
        Node source = nodeRepository.findById(dto.sourceId())
                .orElseThrow(() -> new RuntimeException("Source node found"));
        Node target = nodeRepository.findById(dto.targetId())
                .orElseThrow(() -> new RuntimeException("Target node not found"));

        Edge edge = new Edge();
        edge.setBoard(board);
        edge.setSource(source);
        edge.setTarget(target);
        edge.setCreatedBy(dto.createdBy());

        edge = edgeRepository.save(edge);

        return EdgeMapper.toDto(edge);
    }

    public List<EdgeDto> getEdgesByBoardId(UUID boardId) {
        return edgeRepository.findByBoardId(boardId).stream()
                .map(EdgeMapper::toDto)
                .collect(Collectors.toList());
}
