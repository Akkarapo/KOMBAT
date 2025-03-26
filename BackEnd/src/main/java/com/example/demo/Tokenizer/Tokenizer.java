package com.example.demo.tokenizer;

import com.example.demo.exception.SyntaxError;
import java.util.NoSuchElementException;
import static java.lang.Character.isWhitespace;
import static java.lang.Character.isDigit;
import static java.lang.Character.isLetter;

public class Tokenizer {
    private final String src;
    private String next;
    private int pos;

    public Tokenizer(String s) throws SyntaxError {
        this.src = s;
        pos = 0;
        computeNext();
    }

    public boolean hasNextToken() {
        return next != null;
    }

    public String peek() {
        if (!hasNextToken()) throw new NoSuchElementException("no more tokens");
        return next;
    }

    public boolean peek(String s) {
        if (!hasNextToken()) return false;
        return peek().equals(s);
    }

    public String consume() throws SyntaxError {
        if (!hasNextToken()) throw new NoSuchElementException("no more tokens");
        String result = next;
        computeNext();
        return result;
    }

    public void consume(String s) throws SyntaxError {
        if (peek(s)) consume();
        else throw new SyntaxError(s + " expected");
    }

    private void computeNext() throws SyntaxError {
        StringBuilder sb = new StringBuilder();
        while (pos < src.length() && isWhitespace(src.charAt(pos))) {
            pos++;
        }
        if (pos == src.length()) {
            next = null;
            return;
        }
        char c = src.charAt(pos);
        if (isLetter(c)) {
            sb.append(c);
            pos++;
            while (pos < src.length() && (isLetter(src.charAt(pos)) || isDigit(src.charAt(pos)))) {
                sb.append(src.charAt(pos));
                pos++;
            }
        } else if ("{}+-*/%()^=".indexOf(c) >= 0) {
            sb.append(c);
            pos++;
        } else if (isDigit(c)) {
            sb.append(c);
            pos++;
            while (pos < src.length() && isDigit(src.charAt(pos))) {
                sb.append(src.charAt(pos));
                pos++;
            }
        } else {
            throw new SyntaxError("unknown character: " + c);
        }
        next = sb.toString();
    }
}
