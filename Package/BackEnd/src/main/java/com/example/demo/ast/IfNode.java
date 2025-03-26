package com.example.demo.ast;

public class IfNode implements Node {
    private final Node condition;
    private final Node thenPart;
    private final Node elsePart; // สามารถเป็น null ได้

    public IfNode(Node condition, Node thenPart, Node elsePart) {
        this.condition = condition;
        this.thenPart = thenPart;
        this.elsePart = elsePart;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("if (");
        condition.prettyPrint(sb);
        sb.append(") then ");
        thenPart.prettyPrint(sb);
        if (elsePart != null) {
            sb.append(" else ");
            elsePart.prettyPrint(sb);
        }
    }
}
