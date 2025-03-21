package com.example.demo.ast.expression;

public class Nearby implements Expression {
    private String direction;

    public Nearby(String direction) {
        this.direction = direction;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("nearby ").append(direction);
    }
}
