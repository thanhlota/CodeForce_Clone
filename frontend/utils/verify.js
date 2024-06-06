const Verify = {
    password: (value) => {
        if (!value) return false;
        return true;
    },
    email: (value) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(value).toLowerCase());
    }
}

export default Verify;