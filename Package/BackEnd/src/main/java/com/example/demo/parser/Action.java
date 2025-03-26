package com.example.demo.parser;

public class Action {
    private String type;         // "move", "shoot", หรือ "done"
    private String direction;    // ทิศทางที่ต้องการ เช่น "up", "downleft", เป็นต้น
    private Integer cost;        // ค่าใช้จ่าย (ถ้ามี)
    private String newPosition;  // ตำแหน่งใหม่ (ถ้ามี)

    public Action() {
    }

    public Action(String type, String direction, Integer cost, String newPosition) {
        this.type = type;
        this.direction = direction;
        this.cost = cost;
        this.newPosition = newPosition;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    
    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
    
    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }
    
    public String getNewPosition() {
        return newPosition;
    }

    public void setNewPosition(String newPosition) {
        this.newPosition = newPosition;
    }

    @Override
    public String toString() {
        return "Action{" +
                "type='" + type + '\'' +
                ", direction='" + direction + '\'' +
                ", cost=" + cost +
                ", newPosition='" + newPosition + '\'' +
                '}';
    }
}
