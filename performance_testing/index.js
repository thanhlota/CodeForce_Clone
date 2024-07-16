
const codes = require("./sortingArray");

// URL của API chấm bài
const apiURL = 'http://192.168.172.82:8000/submissions/api/submission/submit';

// Access token của bạn
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhaGFAZ21haWwuY29tIiwiaWQiOjQwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjA4ODUxNDgsImV4cCI6MTcyMDk3MTU0OH0.2DeGo9b-tsKNnWCyXxdk5IOtaZNMs7h3Ufx4iEEp2AE';

// Hàm để gửi request
async function sendRequest(language, code) {
    const response = await fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `access_token=${accessToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
            user_id: 40,
            user_name: "taha",
            problem_id: 16,
            contest_id: 1,
            language: language,
            code: code,
            mem: 256 * 1024 * 1024,
            time: 9000000000
        })
    });
    const data = await response.json();
    console.log(`Response for ${language}:`, data);
}

const languages = ['C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C++', 'C', 'JAVA', 'JAVA'];
let languageIndex = 0;
// Hàm để gửi yêu cầu theo chu kỳ
async function sendRequests() {
    const interval = setInterval(() => {
        const language = languages[languageIndex];
        const code = codes[language];
        sendRequest(language, code);
        languageIndex = (languageIndex + 1) % languages.length;
    }, 1000);

    // Dừng sau 2 tiếng
    setTimeout(async () => {
        clearInterval(interval);
        console.log('Test completed.');
    }, 2 * 60 * 60 * 1000);
}

// Bắt đầu gửi yêu cầu
sendRequests();

// const codes = require("./sortingArray");

// // URL của API chấm bài
// const apiURL = 'http://192.168.172.82:8000/submissions/api/submission/submit';

// // Access token của bạn
// const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhaGFAZ21haWwuY29tIiwiaWQiOjQwLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjA4ODUxNDgsImV4cCI6MTcyMDk3MTU0OH0.2DeGo9b-tsKNnWCyXxdk5IOtaZNMs7h3Ufx4iEEp2AE';

// // Hàm để gửi request
// async function sendRequest(language, code) {
//     try {
//         const response = await fetch(apiURL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Cookie': `access_token=${accessToken}`
//             },
//             credentials: 'include',
//             body: JSON.stringify({
//                 user_id: 40,
//                 user_name: "taha",
//                 problem_id: 16,
//                 contest_id: 1,
//                 language: language,
//                 code: code,
//                 mem: 256 * 1024 * 1024,
//                 time: 9000000000
//             })
//         });
//         const data = await response.json();
//         console.log(`Response for ${language}:`, data);
//     } catch (error) {
//         console.error(`Error for ${language}:`, error);
//     }
// }

// const languages = ['C'];
// let languageIndex = 0;

// // Hàm để gửi yêu cầu
// async function sendRequests() {
//     for (let i = 0; i < 5; i++) {
//         const language = languages[languageIndex];
//         const code = codes[language];
//         sendRequest(language, code);
//         languageIndex = (languageIndex + 1) % languages.length;
//     }
//     console.log('Batch of 50 requests sent.');
// }

// // Hàm để gửi yêu cầu nhiều lần
// async function sendRequestBatches() {
//     sendRequests();
// }

// // Bắt đầu gửi yêu cầu
// sendRequestBatches();    