package com.example.demo.ast;

public class AssignmentNode implements Node {
    private final String identifier;
    private final Node expression;

    public AssignmentNode(String identifier, Node expression) {
        this.identifier = identifier;
        this.expression = expression;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(identifier).append(" = ");
        expression.prettyPrint(sb);
    }
}
