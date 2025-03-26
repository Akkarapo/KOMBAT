package com.example.demo.ast.expression;

public class Opponent implements Expression {
    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("opponent");
    }
}
