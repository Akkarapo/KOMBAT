package project.kombat.model.Parser;

// File: src/com/imperment/kombat/strategy/Interpreter.java


public class Interpreter {
    private ExecutionContext context;

    public Interpreter(ExecutionContext context) {
        this.context = context;
    }

    public void execute(StrategyNode strategy) {
        for (StatementNode stmt : strategy.statements) {
            executeStatement(stmt);
        }
    }

    private void executeStatement(StatementNode stmt) {
        if (stmt instanceof AssignmentStatementNode) {
            AssignmentStatementNode assignStmt = (AssignmentStatementNode) stmt;
            long value = evaluate(assignStmt.expression);
            context.setVariable(assignStmt.identifier, value);
        } else if (stmt instanceof ActionCommandNode) {
            ActionCommandNode action = (ActionCommandNode) stmt;
            // จำลองการดำเนินการคำสั่ง (move, shoot, done)
            System.out.println("Action: " + action.command +
                    (action.argument != null ? " " + action.argument : ""));
            if ("done".equals(action.command)) {
                return; // สิ้นสุดการประมวลผลในเทิร์นนั้น
            }
        } else if (stmt instanceof BlockStatementNode) {
            BlockStatementNode block = (BlockStatementNode) stmt;
            for (StatementNode innerStmt : block.statements) {
                executeStatement(innerStmt);
            }
        } else if (stmt instanceof IfStatementNode) {
            IfStatementNode ifStmt = (IfStatementNode) stmt;
            long condition = evaluate(ifStmt.condition);
            if (condition > 0) {
                executeStatement(ifStmt.thenStatement);
            } else {
                executeStatement(ifStmt.elseStatement);
            }
        } else if (stmt instanceof WhileStatementNode) {
            WhileStatementNode whileStmt = (WhileStatementNode) stmt;
            int iterations = 0;
            while (evaluate(whileStmt.condition) > 0 && iterations < 10000) {
                executeStatement(whileStmt.statement);
                iterations++;
            }
        }
    }

    private long evaluate(ExpressionNode expr) {
        if (expr instanceof LiteralNode) {
            return ((LiteralNode) expr).value;
        } else if (expr instanceof IdentifierNode) {
            return context.getVariable(((IdentifierNode) expr).name);
        } else if (expr instanceof BinaryExpressionNode) {
            BinaryExpressionNode binExpr = (BinaryExpressionNode) expr;
            long left = evaluate(binExpr.left);
            long right = evaluate(binExpr.right);
            switch (binExpr.operator.getType()) {
                case PLUS:    return left + right;
                case MINUS:   return left - right;
                case STAR:    return left * right;
                case SLASH:   return left / right; // integer division
                case PERCENT: return left % right;
                case CARET:   return (long)Math.pow(left, right);
                default:
                    throw new RuntimeException("Unknown operator: " + binExpr.operator.getLexeme());
            }
        } else if (expr instanceof InfoExpressionNode) {
            // สำหรับ info expressions (ally, opponent, nearby) สามารถเชื่อมต่อกับ Game Model ได้
            // ในที่นี้จำลองโดยคืนค่า 0
            return 0;
        }
        throw new RuntimeException("Unknown expression type.");
    }
}
