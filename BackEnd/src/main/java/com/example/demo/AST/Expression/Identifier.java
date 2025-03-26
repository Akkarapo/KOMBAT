package com.example.demo.ast.expression;

public class Identifier implements Expression {
    private String name;

    public Identifier(String name) {
        this.name = name;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(name);
    }
}
