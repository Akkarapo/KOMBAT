package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.ast.Plan;
import java.util.*;

public class StrategyInterpreter {

    /**
     * Legacy or fallback method: interpret an AST without a gameState.
     * If some old code calls interpret(ast), it will delegate to the new method.
     */
    public List<Map<String, Object>> interpret(Node ast) {
        // Calls the overloaded method with an empty gameState
        return interpret(ast, new HashMap<>());
    }

    /**
     * New overloaded method that accepts both an AST and a gameState map.
     */
    public List<Map<String, Object>> interpret(Node ast, Map<String, Object> gameState) {
        List<Map<String, Object>> actions = new ArrayList<>();

        if (ast instanceof Plan) {
            Plan plan = (Plan) ast;
            // Convert the AST to a string so we can do some basic "contains" checks
            StringBuilder sb = new StringBuilder();
            plan.prettyPrint(sb);
            String astString = sb.toString();

            // EXAMPLE: If the DSL contains "move", add a "move" action
            if (astString.contains("move")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "move");
                // Check which direction was found in the DSL
                if (astString.contains("downleft")) {
                    action.put("direction", "downleft");
                } else if (astString.contains("downright")) {
                    action.put("direction", "downright");
                } else if (astString.contains("upleft")) {
                    action.put("direction", "upleft");
                } else if (astString.contains("upright")) {
                    action.put("direction", "upright");
                } else if (astString.contains("down")) {
                    action.put("direction", "down");
                } else if (astString.contains("up")) {
                    action.put("direction", "up");
                } else {
                    action.put("direction", "unknown");
                }

                // You can also use gameState if you like:
                // e.g. Object budget = gameState.get("budget");

                actions.add(action);
            }

            // EXAMPLE: If the DSL contains "shoot", add a "shoot" action
            if (astString.contains("shoot")) {
                Map<String, Object> action = new HashMap<>();
                action.put("type", "shoot");
                if (astString.contains("upleft")) {
                    action.put("direction", "upleft");
                } else {
                    action.put("direction", "unknown");
                }
                action.put("cost", 10);

                actions.add(action);
            }
        }

        // Return the final list of actions
        return actions;
    }
}
