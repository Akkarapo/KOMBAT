package com.example.demo.controller;

import com.example.demo.ast.Node;
import com.example.demo.exception.SyntaxError;
import com.example.demo.parser.StatementParser;
import com.example.demo.parser.StrategyInterpreter;
import com.example.demo.tokenizer.Tokenizer;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Controller สำหรับรับ strategy (DSL) + gameState จาก Frontend
 * แล้วส่งต่อไปยัง StatementParser + StrategyInterpreter
 * เพื่อให้ได้ action list กลับมา
 */
@CrossOrigin(origins = "*")  // <--- เปิด CORS แบบง่าย ๆ (ปรับได้ตามนโยบาย)
@RestController
@RequestMapping("/api")
public class StrategyController {

    @PostMapping("/parseStrategy")
    public Map<String, Object> parseStrategy(@RequestBody Map<String, Object> body) throws SyntaxError {
        // 1) ดึง field "strategy" (โค้ด DSL) จาก body
        String strategyCode = (String) body.get("strategy");
        if (strategyCode == null) {
            throw new IllegalArgumentException("No strategy code provided");
        }

        // 2) ดึง field "gameState" (ข้อมูลเกม) จาก body (แคสต์เป็น Map<String,Object> อย่างปลอดภัย)
        @SuppressWarnings("unchecked")
        Map<String, Object> gameState = (body.get("gameState") instanceof Map)
                ? (Map<String, Object>) body.get("gameState")
                : new HashMap<>();

        // 3) ใช้ Tokenizer + StatementParser เพื่อ parse DSL => AST
        Tokenizer tkz = new Tokenizer(strategyCode);
        StatementParser parser = new StatementParser(tkz);
        Node ast = parser.parse();

        // 4) เรียกใช้ StrategyInterpreter เพื่อตีความ AST ร่วมกับ gameState
        StrategyInterpreter interpreter = new StrategyInterpreter();
        List<Map<String, Object>> actions = interpreter.interpret(ast, gameState);

        // 5) สร้างผลลัพธ์เป็น JSON ส่งกลับ (เช่น { "actions": [...] })
        Map<String, Object> result = new HashMap<>();
        result.put("actions", actions);
        return result;
    }
}
