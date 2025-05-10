package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.entity.Board;
import com.bugradursun.connectthedots.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {
    //

    private final BoardService boardService;

    @PostMapping("/add")
    public ResponseEntity<Board> addBoard(@RequestBody Board board) {
        Board createdBoard = boardService.registerBoard(board);
        return ResponseEntity.ok(createdBoard);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Board>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{label}")
    public ResponseEntity<Board> getBoardByLabel(@PathVariable String label) {
        return boardService.getBoardByLabel(label)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable UUID id, @RequestBody Board board) {
        return ResponseEntity.ok(boardService.updateBoard(id,board));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable UUID id) {
        boardService.deleteBoardById(id);
        return ResponseEntity.noContent().build();
    }



}
