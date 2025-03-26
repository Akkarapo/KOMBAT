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
@CrossOrigin(origins = "http://localhost:3000") // สามารถเพิ่มได้ถ้าจำเป็น
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

        // Log ข้อมูลที่ได้รับ (สำหรับ debugging)
        System.out.println("Received strategy: " + strategyCode);
        System.out.println("Received gameState: " + gameState);

        // 3) Parser: สร้าง tokenizer, parser แล้ว parse เป็น AST
        Tokenizer tkz = new Tokenizer(strategyCode);
        StatementParser parser = new StatementParser(tkz);
        Node ast = parser.parse();

        // 4) Interpreter: ใช้ StrategyInterpreter ประมวลผล AST และ gameState
        StrategyInterpreter interpreter = new StrategyInterpreter();
        // สมมติว่า interpret รองรับการรับ Node และ gameState
        List<Map<String, Object>> actions = interpreter.interpret(ast, gameState);

        // 5) สร้าง debugInfo (เพื่อส่งกลับไปให้ FrontEnd และ log บน server)
        String debugInfo = "Parsed strategy: " + strategyCode + " with gameState: " + gameState.toString();
        System.out.println("Debug info: " + debugInfo);

        // 6) สร้าง response JSON โดยใส่ actions และ debugInfo
        Map<String, Object> result = new HashMap<>();
        result.put("actions", actions);
        result.put("debug", debugInfo);
        return result;
    }
}
