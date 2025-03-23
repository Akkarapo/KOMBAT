package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.ast.Plan;
import java.util.*;

public class StrategyInterpreter {

    /**
     * แปล AST ที่ได้จาก StatementParser เป็นชุด action list
     * ในที่นี้เราใช้วิธีง่ายๆ โดยดึงข้อความจาก AST ด้วย prettyPrint()
     * เพื่อสังเกตการปรากฏของคำสั่ง เช่น move และ shoot
     */
    public List<Map<String, Object>> interpret(Node ast) {
        List<Map<String, Object>> actions = new ArrayList<>();
        if (ast instanceof Plan) {
            Plan plan = (Plan) ast;
            StringBuilder sb = new StringBuilder();
            plan.prettyPrint(sb);
            String astString = sb.toString();

            // ตัวอย่าง: ถ้ามีคำว่า "move" ให้สร้าง action move โดยดึงทิศทางจากข้อความ
            if (astString.contains("move")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "move");
                if (astString.contains("downleft")) action.put("direction", "downleft");
                else if (astString.contains("downright")) action.put("direction", "downright");
                else if (astString.contains("upleft")) action.put("direction", "upleft");
                else if (astString.contains("upright")) action.put("direction", "upright");
                else if (astString.contains("down")) action.put("direction", "down");
                else if (astString.contains("up")) action.put("direction", "up");
                else action.put("direction", "unknown");
                actions.add(action);
            }

            // ตัวอย่าง: ถ้ามีคำว่า "shoot" ให้สร้าง action shoot พร้อมกำหนด cost แบบ dummy
            if (astString.contains("shoot")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "shoot");
                if (astString.contains("upleft")) action.put("direction", "upleft");
                else action.put("direction", "unknown");
                action.put("cost", 10);
                actions.add(action);
            }
        }
        return actions;
    }
}
