package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.dto.BoardRequestDto;
import com.bugradursun.connectthedots.dto.BoardResponseDto;
import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.mapper.BoardMapper;
import com.bugradursun.connectthedots.repository.BoardRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@Service
@RequiredArgsConstructor
public class BoardService {

    // BOARD SERVICE
    private final BoardRepository boardRepository;
    private final BoardMapper boardMapper;
    // registerBoard
    // getAllBoards
    // getBoardByLabel
    // deleteBoardById
    // updateBoard
    @Transactional
    public BoardResponseDto registerBoard(BoardRequestDto boardRequestDto) {
        final var errors = new HashMap<String,String>();
        if(boardRepository.existsByLabel(boardRequestDto.label())) {
            errors.put("label","Board [%s] is already taken".formatted(boardRequestDto.label()));
        }
        if(boardRepository.existsByTitle(boardRequestDto.title())) {
            errors.put("title","Title [%s] is  already taken".formatted(boardRequestDto.title()));
        }
        if(!errors.isEmpty()) {
            throw new ValidationException(errors.toString());
        }
        Board board = boardMapper.toEntity(boardRequestDto);
        Board saved = boardRepository.save(board);
        return boardMapper.toDto(saved);
    }
    public List<BoardResponseDto> getAllBoards() {
        return boardRepository.findAll().stream().map(boardMapper::toDto).toList();
    }
    public BoardResponseDto getBoardByLabel(String label) {
        Board board = boardRepository.findByLabel(label)
                .orElseThrow(() -> new NoSuchElementException("Board not found"));
        return boardMapper.toDto(board);
    }

    @Transactional
    public void deleteBoardById(UUID id) {
        boardRepository.deleteById(id);

    }

    public Board getBoardById(UUID boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND," Board not found!"));
    }

    public BoardResponseDto updateBoard(UUID id,BoardRequestDto requestDto) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Board with ID [%s] not found".formatted(id)));

        board.setLabel(requestDto.label());
        board.setTitle(requestDto.title());
        board.setContent(requestDto.content());
        board.setCreatedBy(requestDto.createdBy());
        board.setDescription(requestDto.description());

        return boardMapper.toDto(boardRepository.save(board));
    }



}
