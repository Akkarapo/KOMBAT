package project.kombat.model.Parser;

public class ActionCommandNode extends StatementNode {
    // สำหรับคำสั่ง done, move, shoot
    public String command;
    public String argument; // สำหรับ direction ของ move/shoot (null สำหรับ done)
    public ExpressionNode expenditure; // สำหรับ shoot command

    public ActionCommandNode(String command, String argument, ExpressionNode expenditure) {
        this.command = command;
        this.argument = argument;
        this.expenditure = expenditure;
    }
}
