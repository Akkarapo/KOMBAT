package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.ast.Plan;

import java.util.*;

public class StrategyInterpreter {

    public List<Map<String, Object>> interpret(Node ast, Map<String, Object> gameState) {
        List<Map<String, Object>> actions = new ArrayList<>();

        if (ast instanceof Plan) {
            Plan plan = (Plan) ast;

            // prettyPrint เพื่อแปลง AST เป็นสตริง
            StringBuilder sb = new StringBuilder();
            plan.prettyPrint(sb);

            // จัดการ whitespace ให้เป็น space เดียว แปลงเป็น lowercase และ trim
            String astString = sb.toString().replaceAll("\\s+", " ").toLowerCase().trim();
            System.out.println("StrategyInterpreter => astString = " + astString);

            // 1) ตรวจว่ามี "move" หรือไม่
            if (astString.contains("move")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "move");

                // ตรวจสอบลำดับเงื่อนไขให้ละเอียด เพื่อจับ "move up" และคำสั่งอื่น ๆ
                if (astString.contains("move up")) {
                    action.put("direction", "up");
                } else if (astString.contains("move downleft")) {
                    action.put("direction", "downleft");
                } else if (astString.contains("move downright")) {
                    action.put("direction", "downright");
                } else if (astString.contains("move down")) {
                    action.put("direction", "down");
                } else if (astString.contains("move upleft")) {
                    action.put("direction", "upleft");
                } else if (astString.contains("move upright")) {
                    action.put("direction", "upright");
                } else {
                    action.put("direction", "unknown");
                }

                // ส่ง mock newPosition กลับ (ตัวอย่าง)
                action.put("newPosition", "(2,3)");
                actions.add(action);
            }

            // 2) ตรวจว่ามี "shoot" หรือไม่
            if (astString.contains("shoot")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "shoot");

                if (astString.contains("shoot up")) {
                    action.put("direction", "up");
                } else if (astString.contains("shoot down")) {
                    action.put("direction", "down");
                } else {
                    action.put("direction", "unknown");
                }

                action.put("cost", 10);
                actions.add(action);
            }

            // 3) ถ้าไม่มีคำสั่ง move หรือ shoot ให้ส่งกลับ done
            if (!astString.contains("move") && !astString.contains("shoot")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "move up");
                actions.add(action);
            }
            System.out.println(actions.toString());
        }

        return actions;
    }
}
