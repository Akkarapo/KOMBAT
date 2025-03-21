package com.example.demo.src.Parser;
import com.example.demo.src.Exception.*;
import com.example.demo.src.Tokenizer.Tokenizer;
import com.example.demo.src.Word.*;
import com.example.demo.src.AST.Node;
import com.example.demo.src.AST.Plan;
import java.util.LinkedList;
import java.util.NoSuchElementException;

import static java.lang.Character.isDigit;
import static java.lang.Character.isLetter;


public class StatementParser implements Parser {

    protected final Tokenizer tkz;
    private static final String[] reservedWords = {"ally", "done", "down", "downleft", "downright", "else", "if",
            "invest", "move", "nearby", "opponent", "relocate", "shoot", "then", "up", "upleft", "upright", "while"};
    private SyntaxError syntaxError_Direction = new SyntaxError("Expected Direction");
    private SyntaxError syntaxError_Command = new SyntaxError("Expected Command");
    protected SyntaxError syntaxError_identifier = new SyntaxError("Illegal Variable");

    public StatementParser(Tokenizer tkz){
        this.tkz = tkz;
    }

    /*public Node parse() throws SyntaxError{
        LinkedList<Statement> p = new LinkedList<>();
        if(!tkz.hasNextToken()) throw new SyntaxError("construction plan is empty");
        while (tkz.hasNextToken()) {
            p.add(parseStatement());
        }
        return new Plan(p);
    }

    private Statement parseStatement() throws SyntaxError{
        if(tkz.peek("while")) return parseWhile();
        else if(tkz.peek("if")) return parseIf();
        else if(tkz.peek("{")) return parseBlock();
        else return parseCommand();
    }

    private WhileStatement parseWhile() throws SyntaxError{
        tkz.consume("while");
        tkz.consume("(");
        Expression expression = new ExprParser(tkz).parse();
        tkz.consume(")");
        Statement statement = parseStatement();
        return new WhileStatement(expression,statement);
    }

    private IfStatement parseIf() throws SyntaxError{
        tkz.consume("if");
        tkz.consume("(");
        Expression expression = new ExprParser(tkz).parse();
        tkz.consume(")");
        tkz.consume("then");
        Statement Then = parseStatement();
        tkz.consume("else");
        Statement Else = parseStatement();
        return new IfStatement(expression,Then,Else);
    }

    private BlockStatement parseBlock() throws SyntaxError{
        LinkedList<Statement> b = new LinkedList<>();
        tkz.consume("{");
        while (!tkz.peek("}")){
            b.add(parseStatement());
        }
        tkz.consume("}");
        return new BlockStatement(b);
    }

    private Statement parseCommand() throws SyntaxError{
        String temp = tkz.consume();
        if(tkz.peek("=")) return parseAssign(temp);
        else return parseAction(temp);
    }

    private Statement parseAssign(String identifier) throws SyntaxError{
        if(!isIdentifier(identifier)) throw syntaxError_identifier;
        Identifier var = new Identifier(identifier);
        tkz.consume("=");
        Expression expr = new ExprParser(tkz).parse();
        return new AssignStatement(var,expr);
    }

    private Statement parseAction(String command) throws SyntaxError{
        Command c;
        try {
            c = Command.valueOf(command);
        }catch (IllegalArgumentException e){
            throw syntaxError_Command;
        }
        if(c.equals(Command.done)) return new ActionCommand(Command.done);
        else if(c.equals(Command.relocate)) return new ActionCommand(Command.relocate);
        else if(c.equals(Command.move)) return parseMove();
        else if(c.equals(Command.shoot)) return parseAttack();
        else return parseHex(c);
    }

    private Statement parseMove() throws SyntaxError{
        return new MoveCommand(parseDirection());
    }

    private Statement parseHex(Command command) throws SyntaxError {
        return new RegionCommand(command,new ExprParser(this.tkz).parse());
    }

    private Statement parseAttack() throws SyntaxError{
        return new ShootCommand(parseDirection(),new ExprParser(this.tkz).parse());
    }

    protected Direction parseDirection() throws SyntaxError{
        try {
            return Direction.valueOf(tkz.consume());
        }catch (IllegalArgumentException e){
            throw syntaxError_Direction;
        }catch (NoSuchElementException e){
            throw e;
        }
    }

    protected boolean isIdentifier(String identifier){
        if(!isLetter(identifier.charAt(0))) return false;
        for(int i=1 ; i<identifier.length() ; i++){
            char c = identifier.charAt(i);
            if(!isLetter(c) && !isDigit(c)) return false;
        }
        for(String rv : reservedWords){
            if(identifier.equals(rv)){
                return false;
            }
        }
        return true;
    }
*/
}
