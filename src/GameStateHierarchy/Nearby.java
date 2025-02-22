package com.example.demo.src.GameStateHierarchy;

import java.util.HashSet;
import java.util.Set;

public class Nearby {

    // ฟังก์ชันเพื่อหาพิกัดที่ใกล้เคียง
    public static Set<Hex> getNearby(int row, int col) {
        Set<Hex> neighbors = new HashSet<>();
        boolean isEven = (col % 2 == 0);

        addNeighbor(neighbors, row - 1, col); // Top
        addNeighbor(neighbors, row + 1, col); // Bottom
        addNeighbor(neighbors, isEven ? row : row - 1, col - 1); // TopLeft
        addNeighbor(neighbors, isEven ? row + 1 : row, col - 1); // BottomLeft
        addNeighbor(neighbors, isEven ? row : row - 1, col + 1); // TopRight
        addNeighbor(neighbors, isEven ? row + 1 : row, col + 1); // BottomRight

        return neighbors;
    }

    // ฟังก์ชันเพิ่มพิกัดที่ใกล้เคียง
    private static void addNeighbor(Set<Hex> neighbors, int row, int col) {
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            neighbors.add(new Hex(row, col));
        }
    }


    public static void main(String[] args) {
        Set<Hex> initialPositions = new HashSet<>();
        initialPositions.add(new Hex(7, 7));
        initialPositions.add(new Hex(7, 6));
        initialPositions.add(new Hex(7, 5));
        initialPositions.add(new Hex(6, 7));
        initialPositions.add(new Hex(6, 6));

        Set<Hex> NearbySet = new HashSet<>();

        for (Hex hex : initialPositions) {
            Set<Hex> neighbors = getNearby(hex.row, hex.col);

            for (Hex neighbor : neighbors) {
                if (!initialPositions.contains(neighbor)) {
                    NearbySet.add(neighbor);
                }
            }
        }

        for (Hex hex : NearbySet) {
            System.out.println(hex);
        }
    }
}



/*
public  class Nearby {

    public static int[][] Nearby(int row, int col) {
        boolean isEven = (col%2==0);
        return new int[][]{TopNearby(row,col),BottomNearby(row,col),TopLeftNearby(row,col,isEven),BottomLeftNearby(row,col,isEven),TopRightNearby(row,col,isEven),BottomRightNearby(row,col,isEven)};
    }

    private static int[] TopNearby(int row, int col) {
        if(row==0)  return null;
        else        return new int[]{row-1,col};
    }

    private static int[] BottomNearby(int row, int col) {
        if(row==7)  return null;
        else        return new int[]{row+1,col};
    }
    private static int[] TopLeftNearby(int row, int col,boolean isEven) {
        if(col==0)  return null;

        if(!isEven){
            if(row==0)  return null;
            else        return new int[]{row-1,col-1};
        }
        else return new int[]{row,col-1};
    }
    private static int[] BottomLeftNearby(int row, int col,boolean isEven) {
        if(col==0)  return null;
        if(isEven){
            if(row==7)  return null;
            else        return new int[]{row+1,col-1};
        }
        else return new int[]{row,col-1};
    }
    private static int[] TopRightNearby(int row, int col,boolean isEven) {
        if(col==7)  return null;
        if(!isEven){
            if(row==0)  return null;
            else        return new int[]{row-1,col+1};
        }
        else return new int[]{row,col+1};
    }
    private static int[] BottomRightNearby(int row, int col,boolean isEven) {
        if(col==7)  return null;
        if(isEven){
            if(row==7)  return null;
            else        return new int[]{row+1,col+1};
        }
        else return new int[]{row,col+1};
    }

    public static void main(String[] args) {
        int[][] x = Nearby(2,3);
        for(int i=0; i<x.length; i++){
            System.out.println((i+1)+") ["+x[i][0]+","+x[i][1]+"]");
        }

    }
}
*/