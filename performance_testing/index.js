
const codes = require("./sortingArray.js");

// URL của API chấm bài
const apiURL = 'http://192.168.172.82:8000/submissions/api/submission/submit';

// Access token của bạn
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJvcm50b2JlYWd5bWVyN0BnbWFpbC5jb20iLCJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzE5Njc2ODE4LCJleHAiOjE3MTk3NjMyMTh9.OO_zCWv2rNLsZQffB8YZKbx1WbfHm95Qt7VMN0DJIwM';

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
            user_id: 1,
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

const languages = ['C++', 'C', 'JAVA'];
let languageIndex = 0;

// Hàm để gửi yêu cầu theo chu kỳ
async function sendRequests() {
    const interval = setInterval(() => {
        const language = languages[languageIndex];
        const code = codes[language];
        sendRequest(language, code);
        languageIndex = (languageIndex + 1) % languages.length;
    }, 1000);

    // Dừng sau 1 tiếng
    setTimeout(async () => {
        clearInterval(interval);
        console.log('Test completed.');
    }, 10 * 1000);
}

// Bắt đầu gửi yêu cầu
sendRequests();
