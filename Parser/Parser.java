package com.example.demo.Parser;

import com.example.demo.AST.Node;
import com.example.demo.Exception.SyntaxError;
import com.example.demo.AST.Node;
import com.example.demo.Exception.SyntaxError;

public interface Parser {
    Node parse() throws SyntaxError;
}
