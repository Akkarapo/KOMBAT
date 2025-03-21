package com.example.demo.src.AST.Expression;
import com.example.demo.src.GameStateHierarchy.Player;

public class Number implements Exception {
    private final long valLong;

    public Number(long val){
        this.valLong = val;
    }

    public double eval(Player player) {
        return valLong;
    }

    public void prettyPrint(StringBuilder s) {
        s.append(valLong);
    }
}

