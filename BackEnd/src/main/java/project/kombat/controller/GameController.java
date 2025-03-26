package project.kombat.controller;

// File: src/com/imperment/kombat/controller/GameController.java

import project.kombat.dto.GameConfig;
import project.kombat.dto.GameState;
import project.kombat.Service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameService gameService;

    // Endpoint เริ่มเกมใหม่ รับ config จาก request body
    @PostMapping("/start")
    public String startGame(@RequestBody GameConfig config) {
        gameService.startGame(config);
        return "Game started successfully.";
    }

    // Endpoint สำหรับรับคำสั่งจากผู้เล่น
    @PostMapping("/command")
    public String processCommand(@RequestParam("command") String command) {
        gameService.processCommand(command);
        return "Command processed.";
    }

    // Endpoint สำหรับดึงสถานะปัจจุบันของเกม
    @GetMapping("/state")
    public GameState getGameState() {
        return gameService.getGameState();
    }
}
