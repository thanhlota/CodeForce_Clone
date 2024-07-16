const CppCode = `#include <iostream>
#include <vector>

int main() {
    // Kích thước mảng cần lớn hơn 256 MB
    const size_t SIZE = 300 * 1024 * 1024; // 300 MB

    try {
        // Tạo mảng lớn
        std::vector<char> largeArray(SIZE);

        // Gán giá trị cho từng phần tử của mảng để sử dụng bộ nhớ
        for(size_t i = 0; i < SIZE; ++i) {
            largeArray[i] = 'a';
        }

        std::cout << "Successfully allocated and initialized the large array." << std::endl;
    } catch (const std::bad_alloc& e) {
        std::cerr << "Memory allocation failed: " << e.what() << std::endl;
    }

    return 0;
}`

module.exports = CppCode;