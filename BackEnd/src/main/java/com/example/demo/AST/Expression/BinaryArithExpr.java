package com.example.demo.ast.expression;

public class BinaryArithExpr implements Expression {
    private Expression left;
    private String operator;
    private Expression right;

    public BinaryArithExpr(Expression left, String operator, Expression right) {
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
