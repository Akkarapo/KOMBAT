package com.example.demo.controller;

import com.example.demo.ast.Node;
import com.example.demo.exception.SyntaxError;
import com.example.demo.parser.StatementParser;
import com.example.demo.parser.StrategyInterpreter;
import com.example.demo.tokenizer.Tokenizer;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
// @CrossOrigin(origins = "http://localhost:3000") // << ใส่หรือไม่ก็ได้ ถ้าใช้ Global Config
public class StrategyController {

    @PostMapping("/parseStrategy")
    public Map<String, Object> parseStrategy(@RequestBody Map<String, Object> body) throws SyntaxError {
        // 1) ดึง strategy DSL
        String strategyCode = (String) body.get("strategy");
        if (strategyCode == null) {
            throw new IllegalArgumentException("No strategy code provided");
        }

        // 2) ดึง gameState (ถ้ามี)
        @SuppressWarnings("unchecked")
        Map<String, Object> gameState = (body.get("gameState") instanceof Map)
                ? (Map<String, Object>) body.get("gameState")
                : new HashMap<>();

        // 3) Parser
        Tokenizer tkz = new Tokenizer(strategyCode);
        StatementParser parser = new StatementParser(tkz);
        Node ast = parser.parse();

        // 4) Interpreter
        StrategyInterpreter interpreter = new StrategyInterpreter();
        // สมมติว่า interpret(...) รองรับการรับ Node + gameState
        // ถ้ายังไม่รองรับ ก็แก้เป็น interpret(ast) เฉย ๆ
        List<Map<String, Object>> actions = interpreter.interpret(ast, gameState);

        // 5) ส่งกลับ
        Map<String, Object> result = new HashMap<>();
        result.put("actions", actions);
        return result;
    }
}
