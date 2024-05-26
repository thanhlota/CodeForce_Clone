import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long n = scanner.nextLong();
        // Calculate the sum
         long sum= 0;

        // Calculate the sum of numbers from 1 to n
        for (long i = 1; i <= n; i++) {
            sum += 1;
        }
        System.out.println(sum);
    }
}