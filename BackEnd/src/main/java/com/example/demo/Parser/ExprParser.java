package com.example.demo.src.Parser;

import com.example.demo.src.AST.Expression.Expression;
import com.example.demo.src.Exception.*;
import com.example.demo.src.Tokenizer.Tokenizer;
import com.example.demo.src.Word.*;
import com.example.demo.src.AST.Node;
import com.example.demo.src.AST.Plan;

public class ExprParser {
    private SyntaxError syntaxError_long = new SyntaxError("Expected Number");

    public ExprParser(Tokenizer tkz) {
        super(tkz);
    }

    @Override
    public Expression parse() throws SyntaxError {
        return Expression();
    }

    private Expression Expression() throws SyntaxError {
        Expression e = Term();
        while (tkz.peek("+") || tkz.peek("-")){
            if(tkz.peek("+")){
                tkz.consume();
                e =  new BinaryArithExpr(e,"+", Term());
            }else if(tkz.peek("-")){
                tkz.consume();
                e =  new BinaryArithExpr(e,"-", Term());
            }
        }
        return e;
    }

    private Expression Term() throws SyntaxError {
        Expression e = Factor();
        while (tkz.peek("*") || tkz.peek("/") || tkz.peek("%")) {
            if(tkz.peek("*")) {
                tkz.consume();
                e = new BinaryArithExpr(e,"*", Factor());
            }else if(tkz.peek("/")) {
                tkz.consume();
                e = new BinaryArithExpr(e,"/", Factor());
            }else if(tkz.peek("%")) {
                tkz.consume();
                e = new BinaryArithExpr(e,"%", Factor());
            }
        }
        return e;
    }

    private Expression Factor() throws SyntaxError {
        Expression p = Power();
        if (tkz.peek("^")){
            tkz.consume();
            Expression f = Factor();
            return new BinaryArithExpr(p,"^",f);
        }
        return p;
    }

    private Expression Power() throws SyntaxError{
        Expression e;
        String number = tkz.peek();
        if(isDigit(number.charAt(0))){
            try {
                tkz.consume();
                e = new Number(Long.parseUnsignedLong(number));
            }catch (NumberFormatException error){
                throw error;
            }
        }else if(tkz.peek("(")){
            tkz.consume("(");
            e = Expression();
            tkz.consume(")");
        }else if(tkz.peek("opponent")){
            tkz.consume();
            e = InfoExpression(true);
        }else if(tkz.peek("nearby")){
            tkz.consume();
            e = InfoExpression(false);
        }else{
            String identifier = tkz.consume();
            if(!isIdentifier(identifier)) throw syntaxError_identifier;
            e = new Identifier(identifier);
        }
        return e;
    }

    private Expression InfoExpression(boolean isOpponent) throws SyntaxError {
        if(isOpponent) return new Opponent();
        else return new Nearby(parseDirection());
    }
}
