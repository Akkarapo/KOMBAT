package project.kombat.model.Parser;

// สำหรับ InfoExpression (ally, opponent, nearby)
public class InfoExpressionNode extends ExpressionNode {
    public String infoType; // ally, opponent, nearby
    public String direction; // ถ้ามี (สำหรับ nearby)

    public InfoExpressionNode(String infoType, String direction) {
        this.infoType = infoType;
        this.direction = direction;
    }
}
