package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.dto.CreateNodeRequest;
import com.bugradursun.connectthedots.dto.NodeDto;
import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.entity.Node;
import static com.bugradursun.connectthedots.mapper.NodeMapper.toDto;

import com.bugradursun.connectthedots.mapper.NodeMapper;
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
public class NodeService {
    private final NodeRepository nodeRepository;
    private final BoardRepository boardRepository;

    public NodeDto createNode(CreateNodeRequest request) {
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("Board not found"));
        Node node = new Node();
        node.setContent(request.getContent());
        node.setBoard(board);
        node.setCreatedBy(request.getCreatedBy());

        Node saved = nodeRepository.save(node);
        return toDto(saved);
    }

    public List<NodeDto> getNodesByBoardId(UUID boardId) {
        return nodeRepository.findByBoardId(boardId)
                .stream()
                .map(NodeMapper::toDto)
                .collect(Collectors.toList());
    }

}
