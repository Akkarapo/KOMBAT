package com.example.demo.model;

public class Player {
    private String name;
    private int score;

    public Player(String name) {
        this.name = name;
        this.score = 0;
    }

    public String getName() {
        return name;
    }

    public int getScore() {
        return score;
    }

    public void addScore(int points) {
        this.score += points;
    }

    // เพิ่มฟังก์ชันอื่น ๆ ตามความจำเป็น
}
