package com.example.demo.controller;

import com.example.demo.exception.SyntaxError;
import com.example.demo.parser.StatementParser;
import com.example.demo.parser.StrategyInterpreter;
import com.example.demo.tokenizer.Tokenizer;
import com.example.demo.ast.Node;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class StrategyController {

    @PostMapping("/parseStrategy")
    public Map<String, Object> parseStrategy(@RequestBody Map<String, String> body) throws SyntaxError {
        String strategyCode = body.get("strategy");
        if (strategyCode == null) {
            throw new IllegalArgumentException("No strategy code provided");
        }

        // สร้าง Tokenizer และ StatementParser เพื่อแปลง DSL เป็น AST
        Tokenizer tkz = new Tokenizer(strategyCode);
        StatementParser parser = new StatementParser(tkz);
        Node ast = parser.parse();

        // ใช้ StrategyInterpreter แปล AST เป็น action list
        StrategyInterpreter interpreter = new StrategyInterpreter();
        List<Map<String, Object>> actions = interpreter.interpret(ast);

        Map<String, Object> result = new HashMap<>();
        result.put("actions", actions);
        return result;
    }
}
