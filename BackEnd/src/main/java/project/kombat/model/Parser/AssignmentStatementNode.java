package project.kombat.model.Parser;

public class AssignmentStatementNode extends StatementNode {
    public String identifier;
    public ExpressionNode expression;

    public AssignmentStatementNode(String identifier, ExpressionNode expression) {
        this.identifier = identifier;
        this.expression = expression;
    }
}
