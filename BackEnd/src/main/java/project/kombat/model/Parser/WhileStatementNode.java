package project.kombat.model.Parser;

public class WhileStatementNode extends StatementNode {
    public ExpressionNode condition;
    public StatementNode statement;

    public WhileStatementNode(ExpressionNode condition, StatementNode statement) {
        this.condition = condition;
        this.statement = statement;
    }
}
