package com.example.demo.src.ParserAndEvaluatorHierarchy.Tokenizer;

import com.example.demo.Exception.*;
import java.util.NoSuchElementException;

import static java.lang.Character.*;
import static java.lang.Character.isDigit;
import com.example.demo.AST.RestricWord.*;
public class Tokenizer {
    private final String src;
    private String next;
    private int pos;

    public Tokenizer(String s) throws SyntaxError {
        this.src = s;
        pos = 0;
        computeNext();
    }

    public boolean hasNextToken(){
        return next != null;
    }

    public String peek(){
        if(!hasNextToken()) throw new NoSuchElementException("no more tokens");
        return next;
    }

    public boolean peek(String s){
        if(!hasNextToken()) return false;
        return peek().equals(s);
    }

    public String consume() throws  SyntaxError {
        if(!hasNextToken()) throw new NoSuchElementException("no more tokens");
        String result = next;
        computeNext();
        return result;
    }

    public void consume(String s) throws SyntaxError {
        if(peek(s)) consume();
        else throw new SyntaxError(s + " expected");
    }

    private void computeNext() throws  SyntaxError {
        StringBuilder s = new StringBuilder();
        while (pos < src.length() && isWhitespace(src.charAt(pos))){
            pos++;  // ignore whitespace
        }
        if (pos == src.length()) {
            next = null;
            return;
        }  // no more tokens
        char c = src.charAt(pos);
        if (isLetter(c)) {
            s.append(c);
            for (pos++; pos < src.length() && (isLetter(src.charAt(pos))||isDigit(src.charAt(pos))); pos++){
                s.append(src.charAt(pos));
            }
        }
        else if (c == '{' || c == '}'||c == '+'||c == '-' ||c == '*'||c == '/' ||c == '%' ||c == '(' ||c == ')'||c == '^'||c == '=') {
            s.append(c);
            pos++;
        }
        else if (isDigit(c)) {
            s.append(c);
            for (pos++; pos < src.length() && isDigit(src.charAt(pos)); pos++){
                s.append(src.charAt(pos));
            }
        }
        else {
            throw new SyntaxError("unknown character: " + c);
        }
        next = s.toString();
    }
}
