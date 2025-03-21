package com.example.demo.controller;

import com.example.demo.src.Exception.SyntaxError;
import com.example.demo.src.Parser.StatementParser;
import com.example.demo.src.Tokenizer.Tokenizer;
// ↑ import อื่น ๆ ตามไฟล์ parser ของคุณ

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class StrategyController {

    @PostMapping("/parseStrategy")
    public Map<String, Object> parseStrategy(@RequestBody Map<String, String> body) throws SyntaxError {
        // 1) รับ string strategy จาก JSON body
        String strategyCode = body.get("strategy");
        if (strategyCode == null) {
            throw new IllegalArgumentException("No strategy code provided");
        }

        // 2) สร้าง Tokenizer และ Parser ของคุณ
        Tokenizer tkz = new Tokenizer(strategyCode);
        StatementParser parser = new StatementParser(tkz);
        // Node ast = parser.parse(); // สมมุติว่าคุณเปิด parse() ไว้แล้ว

        // TODO: แปลง AST -> Action list ตาม logic ของคุณ
        // ในตัวอย่างนี้ ขอยกตัวอย่างผลลัพธ์เป็น Action 2 อัน
        List<Map<String, Object>> actions = new ArrayList<>();
        
        Map<String, Object> a1 = new HashMap<>();
        a1.put("type", "move");
        a1.put("direction", "up");
        actions.add(a1);

        Map<String, Object> a2 = new HashMap<>();
        a2.put("type", "shoot");
        a2.put("direction", "up");
        a2.put("cost", 10);
        actions.add(a2);

        // 3) ใส่ลงใน result และส่งกลับ
        Map<String, Object> result = new HashMap<>();
        result.put("actions", actions);
        return result;
    }
}
