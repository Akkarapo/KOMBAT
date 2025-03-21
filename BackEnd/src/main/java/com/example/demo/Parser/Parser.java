package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.exception.SyntaxError;

public interface Parser {
    Node parse() throws SyntaxError;
}
