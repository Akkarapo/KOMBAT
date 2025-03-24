package com.example.demo.src.Utilities;

public class Direction {
    private static final int BOARD_SIZE = 8;

    public static int[] getTop(int row, int col) {
        return (row > 0) ? new int[]{row - 1, col} : new int[]{-1, -1};
    }

    public static int[] getBottom(int row, int col) {
        return (row < BOARD_SIZE - 1) ? new int[]{row + 1, col} : new int[]{-1, -1};
    }

    public static int[] getTopLeft(int row, int col, boolean isEven) {
        if (col == 0) return new int[]{-1, -1};
        return (!isEven && row > 0) ? new int[]{row - 1, col - 1} : new int[]{row, col - 1};
    }

    public static int[] getBottomLeft(int row, int col, boolean isEven) {
        if (col == 0) return new int[]{-1, -1};
        return (isEven && row < BOARD_SIZE - 1) ? new int[]{row + 1, col - 1} : new int[]{row, col - 1};
    }

    public static int[] getTopRight(int row, int col, boolean isEven) {
        if (col == BOARD_SIZE - 1) return new int[]{-1, -1};
        return (!isEven && row > 0) ? new int[]{row - 1, col + 1} : new int[]{row, col + 1};
    }

    public static int[] getBottomRight(int row, int col, boolean isEven) {
        if (col == BOARD_SIZE - 1) return new int[]{-1, -1};
        return (isEven && row < BOARD_SIZE - 1) ? new int[]{row + 1, col + 1} : new int[]{row, col + 1};
    }
}

