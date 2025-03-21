package com.example.demo.parser;

import com.example.demo.ast.Node;

public class ActionCommand implements Node {
    private Command command;

    public ActionCommand(Command command) {
        this.command = command;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(command.toString());
    }
}
