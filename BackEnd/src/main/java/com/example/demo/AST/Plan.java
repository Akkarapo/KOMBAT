package com.example.demo.ast;

import java.util.List;

public class Plan implements Node {
    private List<Node> statements;

    public Plan(List<Node> statements) {
        this.statements = statements;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        for (Node n : statements) {
            n.prettyPrint(sb);
            sb.append("\n");
        }
    }
}
