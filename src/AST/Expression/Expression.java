package com.example.demo.src.AST.Expression;
import com.example.demo.src.AST.Node;
import com.example.demo.src.GameStateHierarchy.Player;


public interface Expression extends Node {
    double eval(Player player);// throws EvalError;
}
