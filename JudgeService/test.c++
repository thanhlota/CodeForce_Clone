#include <iostream>
#include <chrono>
using namespace std;
int main() {
    auto start = std::chrono::high_resolution_clock::now();
    int sum=0;
    for(int i=0;i<2000000000;i++){
        sum+=1;
    }
     auto end = std::chrono::high_resolution_clock::now();
     auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    // In ra thời gian thực hiện
    std::cout << "Thời gian thực hiện: " << duration.count() << " milliseconds";
}