package com.example.demo.ast.expression;

public class NumberExpr implements Expression {
    private long value;

    public NumberExpr(long value) {
        this.value = value;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(value);
    }
}
