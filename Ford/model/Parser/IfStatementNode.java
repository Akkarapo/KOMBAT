package project.kombat.model.Parser;

public class IfStatementNode extends StatementNode {
    public ExpressionNode condition;
    public StatementNode thenStatement;
    public StatementNode elseStatement;

    public IfStatementNode(ExpressionNode condition, StatementNode thenStatement, StatementNode elseStatement) {
        this.condition = condition;
        this.thenStatement = thenStatement;
        this.elseStatement = elseStatement;
    }
}
