import ReactQuill from "react-quill";
const TextReader = ({ text }) => {
    return (
        <ReactQuill
            value={text}
            readOnly={true}
        />
    )
}

export default TextReader;