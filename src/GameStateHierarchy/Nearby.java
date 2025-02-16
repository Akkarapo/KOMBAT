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
