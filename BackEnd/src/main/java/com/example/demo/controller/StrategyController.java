package com.example.demo.controller;

import com.example.demo.exception.SyntaxError;
import com.example.demo.parser.StatementParser;
import com.example.demo.tokenizer.Tokenizer;
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

        // สร้าง Tokenizer และ StatementParser
        Tokenizer tkz = new Tokenizer(strategyCode);
        StatementParser parser = new StatementParser(tkz);
        // Node ast = parser.parse(); // (สามารถเปิดใช้งานเมื่อ implement parse() อย่างสมบูรณ์)

        // Dummy action list ตัวอย่าง:
        List<Map<String, Object>> actions = new ArrayList<>();
        Map<String, Object> action1 = new HashMap<>();
        action1.put("type", "move");
        action1.put("direction", "up");
        actions.add(action1);
        Map<String, Object> action2 = new HashMap<>();
        action2.put("type", "shoot");
        action2.put("direction", "up");
        action2.put("cost", 10);
        actions.add(action2);

        Map<String, Object> result = new HashMap<>();
        result.put("actions", actions);
        return result;
    }
}
