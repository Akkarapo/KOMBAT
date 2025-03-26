package project.kombat.model.Parser;

public class BinaryExpressionNode extends ExpressionNode {
    public ExpressionNode left;
    public Token operator;
    public ExpressionNode right;

    public BinaryExpressionNode(ExpressionNode left, Token operator, ExpressionNode right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
