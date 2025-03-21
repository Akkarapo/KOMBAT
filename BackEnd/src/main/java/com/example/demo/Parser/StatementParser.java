package com.example.demo.parser;

import com.example.demo.ast.Node;
import com.example.demo.ast.Plan;
import com.example.demo.exception.SyntaxError;
import com.example.demo.tokenizer.Tokenizer;
import static java.lang.Character.isLetter;
import static java.lang.Character.isDigit;
import java.util.LinkedList;

public class StatementParser implements Parser {
    protected final Tokenizer tkz;
    private static final String[] reservedWords = {
        "ally", "done", "down", "downleft", "downright", "else", "if",
        "invest", "move", "nearby", "opponent", "relocate", "shoot", "then", "up", "upleft", "upright", "while"
    };
    private SyntaxError syntaxError_Direction = new SyntaxError("Expected Direction");
    private SyntaxError syntaxError_Command = new SyntaxError("Expected Command");
    protected SyntaxError syntaxError_identifier = new SyntaxError("Illegal Variable");

    public StatementParser(Tokenizer tkz) {
        this.tkz = tkz;
    }

    @Override
    public Node parse() throws SyntaxError {
        LinkedList<Node> statements = new LinkedList<>();
        // Dummy parser: consume token by token and add ActionCommand if token matches a Command
        while (tkz.hasNextToken()) {
            String token = tkz.consume();
            try {
                Command cmd = Command.valueOf(token);
                statements.add(new ActionCommand(cmd));
            } catch (IllegalArgumentException e) {
                if (isIdentifier(token)) {
                    // ถ้าเป็น identifier (ที่ไม่ใช่ reserved word) ให้เพิ่ม ActionCommand(done) เป็นค่า default
                    statements.add(new ActionCommand(Command.done));
                } else {
                    throw new SyntaxError("Unexpected token: " + token);
                }
            }
        }
        return new Plan(statements);
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
