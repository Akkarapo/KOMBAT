package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.ast.Plan;

import java.util.*;

public class StrategyInterpreter {
    public List<Map<String, Object>> interpret(Node ast, Map<String, Object> gameState) {
        List<Map<String, Object>> actions = new ArrayList<>();

        if (ast instanceof Plan) {
            Plan plan = (Plan) ast;
            // prettyPrint แปลง AST เป็น String
            StringBuilder sb = new StringBuilder();
            plan.prettyPrint(sb);

            // ทำเป็น lowercase ไว้เช็คง่าย ๆ
            String astString = sb.toString().toLowerCase();

            // 1) ตรวจว่ามี "move" หรือไม่
            if (astString.contains("move")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "move");

                // ลองเช็ค direction ทีละคำ
                if (astString.contains("move up")) {
                    action.put("direction", "up");
                } else if (astString.contains("move down")) {
                    // แต่ต้องระวัง "downleft" / "downright"
                    // แนะนำให้เช็ค downleft/downright ก่อนเช็ค down
                    if (astString.contains("move downleft")) {
                        action.put("direction", "downleft");
                    } else if (astString.contains("move downright")) {
                        action.put("direction", "downright");
                    } else {
                        action.put("direction", "down");
                    }
                } else if (astString.contains("move upleft")) {
                    action.put("direction", "upleft");
                } else if (astString.contains("move upright")) {
                    action.put("direction", "upright");
                }
                // ฯลฯ เพิ่มได้ตามต้องการ
                else {
                    // ไม่เจอคำว่า up/down/left/right => unknown
                    action.put("direction", "unknown");
                }

                // สมมติส่ง newPosition กลับด้วย (mock)
                action.put("newPosition", "(2,3)");
                actions.add(action);
            }

            // 2) ตรวจว่ามี "shoot" หรือไม่
            if (astString.contains("shoot")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "shoot");

                // สมมติหา direction
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

            // 3) ถ้าไม่มี move / shoot => done
            if (!astString.contains("move") && !astString.contains("shoot")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "done");
                actions.add(action);
            }
        }

        return actions;
    }
}
