const FibonacciCode = {
    "C": `#include <stdio.h>

unsigned long long fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    unsigned long long a = 0, b = 1, c;
    for (int i = 2; i <= n; ++i) {
        c = a + b;
        a = b;
        b = c;
    }

    return b;
}

int main() {
    int n; scanf("%d",&n);
    unsigned long long fib = fibonacci(n);
    printf("%llu",fib);
    return 0;
}`,
    "C++": `#include <iostream>
using namespace std;

unsigned long long fibonacci(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    unsigned long long a = 0, b = 1, c;
    for (int i = 2; i <= n; ++i) {
        c = a + b;
        a = b;
        b = c;
    }
    return b;
}

int main() {
    int n;cin>>n;
    unsigned long long fib = fibonacci(n);
    cout << fib;
    return 0;
}`,
    "JAVA": `import java.util.Scanner;
public class Main {
  
    public static long fibonacci(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;

        long a = 0, b = 1, c;
        for (int i = 2; i <= n; ++i) {
            c = a + b;
            a = b;
            b = c;
        }

        return b;
    }

    public static void main(String[] args) {
       Scanner scanner = new Scanner(System.in);
      int n = scanner.nextInt();
        long fib = fibonacci(n);
        System.out.print(fib);
    }
}`
}
module.exports = FibonacciCode;