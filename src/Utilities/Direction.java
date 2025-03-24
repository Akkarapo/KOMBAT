package com.example.demo.src.Utilities;

public class Direction {
    private static final int BOARD_SIZE = 8;

    public static int[] up(int row, int col) {
        return (row > 0) ? new int[]{row - 1, col} : new int[]{-1, -1};
    }

    public static int[] down(int row, int col) {
        return (row < BOARD_SIZE - 1) ? new int[]{row + 1, col} : new int[]{-1, -1};
    }

    public static int[] upleft(int row, int col, boolean isEven) {
        if (col == 0) return new int[]{-1, -1};
        return (!isEven && row > 0) ? new int[]{row - 1, col - 1} : new int[]{row, col - 1};
    }

    public static int[] downleft(int row, int col, boolean isEven) {
        if (col == 0) return new int[]{-1, -1};
        return (isEven && row < BOARD_SIZE - 1) ? new int[]{row + 1, col - 1} : new int[]{row, col - 1};
    }

    public static int[] upright(int row, int col, boolean isEven) {
        if (col == BOARD_SIZE - 1) return new int[]{-1, -1};
        return (!isEven && row > 0) ? new int[]{row - 1, col + 1} : new int[]{row, col + 1};
    }

    public static int[] downright(int row, int col, boolean isEven) {
        if (col == BOARD_SIZE - 1) return new int[]{-1, -1};
        return (isEven && row < BOARD_SIZE - 1) ? new int[]{row + 1, col + 1} : new int[]{row, col + 1};
    }
}

