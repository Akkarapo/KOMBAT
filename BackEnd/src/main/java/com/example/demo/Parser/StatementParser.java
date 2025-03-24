package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.ast.Plan;
import com.example.demo.ast.AssignmentNode;
import com.example.demo.ast.WhileNode;
import com.example.demo.ast.IfNode;
import com.example.demo.ast.BlockNode;
import com.example.demo.ast.expression.BinaryArithExpr;
import com.example.demo.ast.expression.NumberExpr;
import com.example.demo.ast.expression.Identifier;
import com.example.demo.ast.expression.Opponent;
import com.example.demo.ast.expression.Nearby;
import com.example.demo.ast.ActionCommand;
import com.example.demo.exception.SyntaxError;
import com.example.demo.tokenizer.Tokenizer;
import static java.lang.Character.isLetter;
import static java.lang.Character.isDigit;
import java.util.LinkedList;
import java.util.List;

public class StatementParser implements Parser {
    protected final Tokenizer tkz;
    private static final String[] reservedWords = {
        "ally", "done", "down", "downleft", "downright", "else", "if",
        "invest", "move", "nearby", "opponent", "relocate", "shoot", "then", "up", "upleft", "upright", "while"
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
                    // ไม่ใช่ assignment ให้พิจารณาเป็น action command
                    return parseActionCommand(id);
                }
            }
            // Default: parse as action command
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

    /**
     * parseActionCommand:
     * หาก parameter id ไม่เป็น null หมายถึง identifier ถูก consume แล้ว
     * จากนั้นตรวจสอบ token เพื่อดูว่าเป็น command หรือไม่
     */
    private Node parseActionCommand(String id) throws SyntaxError {
        String token = (id != null) ? id : tkz.consume();
        try {
            Command cmd = Command.valueOf(token);
            // สำหรับคำสั่งที่อาจมี direction หรือ cost
            if ((cmd == Command.move || cmd == Command.shoot) && tkz.hasNextToken()) {
                String direction = tkz.consume();
                if (cmd == Command.shoot && tkz.peek("cost")) {
                    tkz.consume("cost");
                    Node costExpr = parseExpression();
                    return new ActionCommand(cmd, direction, costExpr);
                }
                return new ActionCommand(cmd, direction);
            }
            return new ActionCommand(cmd);
        } catch (IllegalArgumentException e) {
            return new ActionCommand(Command.done);
        }
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
