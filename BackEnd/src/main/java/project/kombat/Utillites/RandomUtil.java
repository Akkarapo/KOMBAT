package project.kombat.Utillites;



import java.util.Random;

public class RandomUtil {
    private static final Random RANDOM = new Random();

    /**
     * คืนค่า random number ในช่วง 0 ถึง 999 (รวมทั้ง 0 และ 999)
     * @return ค่า random number
     */
    public static int getRandomNumber() {
        return RANDOM.nextInt(1000);
    }
}

