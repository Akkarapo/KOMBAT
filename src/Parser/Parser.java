package com.example.demo.src.Parser;
import com.example.demo.src.AST.Node;
import com.example.demo.src.Exception.*;
public interface Parser {
    Node parse() throws SyntaxError;
}
