package com.example.demo.parser;

import com.example.demo.ast.*;
import com.example.demo.ast.expression.*;
import com.example.demo.exception.SyntaxError;
import com.example.demo.tokenizer.Tokenizer;

import static java.lang.Character.isLetter;
import static java.lang.Character.isDigit;

import java.util.LinkedList;
import java.util.List;

public class StatementParser implements Parser {
    protected final Tokenizer tkz;
    
    // สมมติคุณมี enum Command ใน com.example.demo.ast
    // เช่น: public enum Command { move, shoot, done, ... }

    private static final String[] reservedWords = {
        "ally", "done", "down", "downleft", "downright", "else", "if",
        "invest", "move", "nearby", "opponent", "relocate", "shoot", "then", 
        "up", "upleft", "upright", "while"
    };

    public StatementParser(Tokenizer tkz) {
        this.tkz = tkz;
    }

    @Override
    public Node parse() throws SyntaxError {
        List<Node> statements = new LinkedList<>();
        while (tkz.hasNextToken()) {
            statements.add(parseStatement());
        }
        return new Plan(statements);
    }

    private Node parseStatement() throws SyntaxError {
        if (tkz.peek("while")) {
            return parseWhileStatement();
        } else if (tkz.peek("if")) {
            return parseIfStatement();
        } else if (tkz.peek("{")) {
            return parseBlock();
        } else {
            // ตรวจสอบ assignment: identifier '=' ...
            String token = tkz.peek();
            if (isIdentifier(token)) {
                String id = tkz.consume();
                if (tkz.peek("=")) {
                    tkz.consume("="); // Consume '='
                    Node expr = parseExpression();
                    return new AssignmentNode(id, expr);
                } else {
                    // ไม่ใช่ assignment => อาจเป็น action command
                    return parseActionCommand(id);
                }
            }
            // ถ้าไม่ใช่ identifier => parse action command แบบไม่ระบุ id
            return parseActionCommand(null);
        }
    }

    private Node parseWhileStatement() throws SyntaxError {
        tkz.consume("while");
        tkz.consume("(");
        Node condition = parseExpression();
        tkz.consume(")");
        Node body = parseBlock();
        return new WhileNode(condition, body);
    }

    private Node parseIfStatement() throws SyntaxError {
        tkz.consume("if");
        tkz.consume("(");
        Node condition = parseExpression();
        tkz.consume(")");
        tkz.consume("then");
        Node thenPart = parseStatementOrBlock();
        Node elsePart = null;
        if (tkz.peek("else")) {
            tkz.consume("else");
            elsePart = parseStatementOrBlock();
        }
        return new IfNode(condition, thenPart, elsePart);
    }

    private Node parseStatementOrBlock() throws SyntaxError {
        if (tkz.peek("{")) {
            return parseBlock();
        } else {
            return parseStatement();
        }
    }

    private Node parseBlock() throws SyntaxError {
        tkz.consume("{");
        List<Node> statements = new LinkedList<>();
        while (!tkz.peek("}")) {
            statements.add(parseStatement());
        }
        tkz.consume("}");
        return new BlockNode(statements);
    }

    private Node parseActionCommand(String id) throws SyntaxError {
        String token = (id != null) ? id : tkz.consume();
        try {
            // พยายามแปลง token เป็น Command enum
            Command cmd = Command.valueOf(token);
            // ถ้าเป็น move หรือ shoot อาจมี direction ต่อท้าย
            if ((cmd == Command.move || cmd == Command.shoot) && tkz.hasNextToken()) {
                String direction = tkz.peek();
                // ถ้าทิศทางเป็น reservedWords เช่น up, downleft, downright
                // หรือเป็น identifier (เช่น cost)
                if (!reservedWordsContain(direction) && !isIdentifier(direction)) {
                    // ถ้า direction ไม่ตรง
                    // อาจ skip หรือ throw error
                } else {
                    direction = tkz.consume();
                    // ถ้าคำสั่ง shoot cost ...
                    if (cmd == Command.shoot && tkz.peek("cost")) {
                        tkz.consume("cost");
                        Node costExpr = parseExpression();
                        return new ActionCommand(cmd, direction, costExpr);
                    }
                    return new ActionCommand(cmd, direction);
                }
            }
            // ไม่เจอ direction => เป็น command เดี่ยว ๆ
            return new ActionCommand(cmd);
        } catch (IllegalArgumentException e) {
            // ถ้า token ไม่ match enum => default done
            return new ActionCommand(Command.done);
        }
    }

    private boolean reservedWordsContain(String token) {
        for (String rv : reservedWords) {
            if (token.equals(rv)) {
                return true;
            }
        }
        return false;
    }

    // Expression Parser
    private Node parseExpression() throws SyntaxError {
        return parseAdditive();
    }

    private Node parseAdditive() throws SyntaxError {
        Node left = parseMultiplicative();
        while (tkz.peek("+") || tkz.peek("-")) {
            String op = tkz.consume();
            Node right = parseMultiplicative();
            left = new BinaryArithExpr(left, op, right);
        }
        return left;
    }

    private Node parseMultiplicative() throws SyntaxError {
        Node left = parsePrimary();
        while (tkz.peek("*") || tkz.peek("/") || tkz.peek("%") || tkz.peek("^")) {
            String op = tkz.consume();
            Node right = parsePrimary();
            left = new BinaryArithExpr(left, op, right);
        }
        return left;
    }

    private Node parsePrimary() throws SyntaxError {
        String token = tkz.peek();
        if (tkz.peek("(")) {
            tkz.consume("(");
            Node expr = parseExpression();
            tkz.consume(")");
            return expr;
        } else if (isDigit(token.charAt(0))) {
            tkz.consume();
            try {
                return new NumberExpr(Long.parseLong(token));
            } catch (NumberFormatException ex) {
                throw new SyntaxError("Invalid number format: " + token);
            }
        } else if (tkz.peek("opponent")) {
            tkz.consume();
            return new Opponent();
        } else if (tkz.peek("nearby")) {
            tkz.consume();
            String direction = tkz.consume();
            return new Nearby(direction);
        } else if (isIdentifier(token)) {
            tkz.consume();
            return new Identifier(token);
        } else {
            throw new SyntaxError("Unexpected token in expression: " + token);
        }
    }

    protected boolean isIdentifier(String identifier) {
        if (!isLetter(identifier.charAt(0))) return false;
        for (int i = 1; i < identifier.length(); i++) {
            char c = identifier.charAt(i);
            if (!isLetter(c) && !isDigit(c)) return false;
        }
        for (String rv : reservedWords) {
            if (identifier.equals(rv)) {
                return false;
            }
        }
        return true;
    }
}
