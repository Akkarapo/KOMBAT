package com.example.demo.ast;

import java.util.List;

public class BlockNode implements Node {
    private final List<Node> statements;

    public BlockNode(List<Node> statements) {
        this.statements = statements;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("{\n");
        for (Node stmt : statements) {
            stmt.prettyPrint(sb);
            sb.append("\n");
        }
        sb.append("}");
    }
}
