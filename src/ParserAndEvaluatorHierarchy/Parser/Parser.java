package com.example.demo.src.ParserAndEvaluatorHierarchy.Parser;

import com.example.demo.AST.Node;
import com.example.demo.Exception.SyntaxError;

public interface Parser {
    Node parse() throws SyntaxError;
}
