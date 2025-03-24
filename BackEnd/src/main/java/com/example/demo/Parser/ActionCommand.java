package com.example.demo.parser;

import com.example.demo.ast.Node;

public class ActionCommand implements Node {
    private Command command;
    private String direction;
    private Node cost;

    public ActionCommand(Command command) {
        this.command = command;
    }

    public ActionCommand(Command command, String direction) {
        this.command = command;
        this.direction = direction;
    }

    public ActionCommand(Command command, String direction, Node cost) {
        this.command = command;
        this.direction = direction;
        this.cost = cost;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(command.toString());
        if (direction != null) {
            sb.append(" ").append(direction);
        }
        if (cost != null) {
            sb.append(" cost ");
            cost.prettyPrint(sb);
        }
    }
}
