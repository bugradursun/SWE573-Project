package com.bugradursun.connectthedots.mapper;

import com.bugradursun.connectthedots.dto.BoardRequestDto;
import com.bugradursun.connectthedots.dto.BoardResponseDto;
import com.bugradursun.connectthedots.entity.Board;
import org.springframework.stereotype.Component;

@Component
public class BoardMapper {

    public Board toEntity(BoardRequestDto boardRequestDto) {
        Board board = new Board();
        board.setLabel(boardRequestDto.label());
        board.setTitle(boardRequestDto.title());
        board.setContent(boardRequestDto.content());
        board.setCreatedBy(boardRequestDto.createdBy());
        board.setDescription(boardRequestDto.description());
        return board;
    }
    public BoardResponseDto toDto(Board board) {
        return new BoardResponseDto(
                board.getId(),
                board.getLabel(),
                board.getTitle(),
                board.getContent(),
                board.getCreatedBy(),
                board.getDescription(),
                board.getCreatedAt(),
                board.getUpdatedAt()
        );
    }
}
