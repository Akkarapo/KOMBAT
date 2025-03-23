package com.example.demo.ast;

public class WhileNode implements Node {
    private final Node condition;
    private final Node body;

    public WhileNode(Node condition, Node body) {
        this.condition = condition;
        this.body = body;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("while (");
        condition.prettyPrint(sb);
        sb.append(") ");
        body.prettyPrint(sb);
    }
}
