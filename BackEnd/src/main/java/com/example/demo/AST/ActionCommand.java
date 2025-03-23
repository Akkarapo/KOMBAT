package com.example.demo.ast;

import com.example.demo.parser.Command;

public class ActionCommand implements Node {
    private final Command command;
    private final String direction; // optional
    private final Node costExpr; // optional expression สำหรับ shoot

    // Constructor สำหรับ command ที่ไม่มี direction
    public ActionCommand(Command command) {
        this(command, null, null);
    }
    
    // Constructor สำหรับ command ที่มี direction
    public ActionCommand(Command command, String direction) {
        this(command, direction, null);
    }
    
    // Constructor สำหรับ command ที่มี direction และ cost expression
    public ActionCommand(Command command, String direction, Node costExpr) {
        this.command = command;
        this.direction = direction;
        this.costExpr = costExpr;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(command);
        if (direction != null) {
            sb.append(" ").append(direction);
        }
        if (costExpr != null) {
            sb.append(" cost ");
            costExpr.prettyPrint(sb);
        }
    }
}
