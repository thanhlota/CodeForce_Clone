const PrimeNumberCode = {
    "C": `
    #include <stdio.h>

int isPrime(int n) {
    if (n <= 1) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main() {
    int number;
    scanf("%d", &number);   
    if (isPrime(number)) {
        printf("TRUE");
    } else {
        printf("FALSE");
    }
    
    return 0;
}`,
    "C++": `#include <iostream>
using namespace std;

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int number;
    cin >> number;  
    if (isPrime(number)) {
        cout << "TRUE";
    } else {
        cout << "FALSE";
    }
    
    return 0;
}`,
    "JAVA": `import java.util.Scanner;

public class Main {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int number = scanner.nextInt();
        if (isPrime(number)) {
            System.out.print("TRUE");
        } else {
            System.out.print("FALSE");
        }
    }
}`
}
module.exports = PrimeNumberCode;