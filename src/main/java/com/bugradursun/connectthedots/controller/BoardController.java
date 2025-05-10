package com.bugradursun.connectthedots.controller;

import com.bugradursun.connectthedots.dto.BoardRequestDto;
import com.bugradursun.connectthedots.dto.BoardResponseDto;
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

    private final BoardService boardService;

    @PostMapping("/add")
    public ResponseEntity<BoardResponseDto> addBoard(@RequestBody BoardRequestDto boardRequestDto) {
        return ResponseEntity.ok(boardService.registerBoard(boardRequestDto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BoardResponseDto>> getAllBoards() {
        return ResponseEntity.ok(boardService.getAllBoards());
    }

    @GetMapping("/{label}")
    public ResponseEntity<BoardResponseDto> getBoardByLabel(@PathVariable String label) {
        return ResponseEntity.ok(boardService.getBoardByLabel(label));
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<BoardResponseDto> updateBoard(@PathVariable UUID id, @RequestBody BoardRequestDto boardRequestDto) {
        return ResponseEntity.ok(boardService.updateBoard(id,boardRequestDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable UUID id) {
        boardService.deleteBoardById(id);
        return ResponseEntity.noContent().build();
    }



}
