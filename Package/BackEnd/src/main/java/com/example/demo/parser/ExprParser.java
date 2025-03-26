package com.example.demo.parser;

import com.example.demo.ast.expression.Expression;
import com.example.demo.ast.expression.BinaryArithExpr;
import com.example.demo.ast.expression.NumberExpr;
import com.example.demo.ast.expression.Identifier;
import com.example.demo.ast.expression.Opponent;
import com.example.demo.ast.expression.Nearby;
import com.example.demo.exception.SyntaxError;
import com.example.demo.tokenizer.Tokenizer;

import static java.lang.Character.isDigit;
import static java.lang.Character.isLetter;

public class ExprParser {
    private Tokenizer tkz;
    private SyntaxError syntaxError_identifier = new SyntaxError("Illegal Identifier");

    public ExprParser(Tokenizer tkz) {
        this.tkz = tkz;
    }

    public Expression parse() throws SyntaxError {
        return Expression();
    }

    private Expression Expression() throws SyntaxError {
        Expression e = Term();
        while (tkz.peek("+") || tkz.peek("-")) {
            if (tkz.peek("+")) {
                tkz.consume();
                e = new BinaryArithExpr(e, "+", Term());
            } else if (tkz.peek("-")) {
                tkz.consume();
                e = new BinaryArithExpr(e, "-", Term());
            }
        }
        return e;
    }

    private Expression Term() throws SyntaxError {
        Expression e = Factor();
        while (tkz.peek("*") || tkz.peek("/") || tkz.peek("%")) {
            if (tkz.peek("*")) {
                tkz.consume();
                e = new BinaryArithExpr(e, "*", Factor());
            } else if (tkz.peek("/")) {
                tkz.consume();
                e = new BinaryArithExpr(e, "/", Factor());
            } else if (tkz.peek("%")) {
                tkz.consume();
                e = new BinaryArithExpr(e, "%", Factor());
            }
        }
        return e;
    }

    private Expression Factor() throws SyntaxError {
        Expression p = Power();
        if (tkz.peek("^")) {
            tkz.consume();
            Expression f = Factor();
            return new BinaryArithExpr(p, "^", f);
        }
        return p;
    }

    private Expression Power() throws SyntaxError {
        Expression e;
        String token = tkz.peek();
        if (isDigit(token.charAt(0))) {
            try {
                tkz.consume();
                e = new NumberExpr(Long.parseUnsignedLong(token));
            } catch (NumberFormatException error) {
                throw new SyntaxError("Invalid number format");
            }
        } else if (tkz.peek("(")) {
            tkz.consume("(");
            e = Expression();
            tkz.consume(")");
        } else if (tkz.peek("opponent")) {
            tkz.consume();
            e = InfoExpression(true);
        } else if (tkz.peek("nearby")) {
            tkz.consume();
            e = InfoExpression(false);
        } else {
            String id = tkz.consume();
            if (!isIdentifier(id)) throw syntaxError_identifier;
            e = new Identifier(id);
        }
        return e;
    }

    private Expression InfoExpression(boolean isOpponent) throws SyntaxError {
        if (isOpponent) return new Opponent();
        else return new Nearby(parseDirection());
    }

    private String parseDirection() throws SyntaxError {
        return tkz.consume();
    }

    private boolean isIdentifier(String identifier) {
        if (!isLetter(identifier.charAt(0))) return false;
        for (int i = 1; i < identifier.length(); i++) {
            char c = identifier.charAt(i);
            if (!isLetter(c) && !isDigit(c)) return false;
        }
        return true;
    }
}
