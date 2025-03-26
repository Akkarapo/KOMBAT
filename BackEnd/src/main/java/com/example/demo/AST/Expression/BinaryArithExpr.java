package com.example.demo.ast.expression;

import com.example.demo.ast.Node;

public class BinaryArithExpr implements Expression {
    private final Node left;
    private final String operator;
    private final Node right;

    public BinaryArithExpr(Node left, String operator, Node right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("(");
        left.prettyPrint(sb);
        sb.append(" ").append(operator).append(" ");
        right.prettyPrint(sb);
        sb.append(")");
    }
}
