package com.bugradursun.connectthedots.service;

import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.repository.BoardRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class BoardService {

    // BOARD SERVICE
    private final BoardRepository boardRepository;
    // registerBoard
    // getAllBoards
    // getBoardByLabel
    // deleteBoardById
    // updateBoard
    @Transactional
    public Board registerBoard(Board board) {
        final var errors = new HashMap<String,String>();
        if(boardRepository.existsByLabel(board.getLabel())) {
            errors.put("label","Board [%s] is already taken".formatted(board.getLabel()));
        }
        if(boardRepository.existsByTitle(board.getTitle())) {
            errors.put("title","Title [%s] is  already taken".formatted(board.getTitle()));
        }
        if(!errors.isEmpty()) {
            throw new ValidationException(errors.toString());
        }
        return boardRepository.save(board);
    }
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }
    public Optional<Board> getBoardByLabel(String label) {
        return boardRepository.findByLabel(label);
    }

    @Transactional
    public void deleteBoardById(UUID id) {
        if(!boardRepository.existsById(id)) {
            throw new NoSuchElementException("Board with ID [%s] not found".formatted(id));
        }
        boardRepository.deleteById(id);
    }

    public Board updateBoard(UUID id,Board updatedBoard) {
        Board existingBoard = boardRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Board with ID [%s] not found".formatted(id)));

        existingBoard.setLabel(updatedBoard.getLabel());
        existingBoard.setTitle(updatedBoard.getTitle());
        existingBoard.setContent(updatedBoard.getContent());
        existingBoard.setCreatedBy(updatedBoard.getCreatedBy());
        existingBoard.setDescription(updatedBoard.getDescription());

        return boardRepository.save(existingBoard);
    }

}
