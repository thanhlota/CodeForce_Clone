import { updateUserInfo } from "@/utils/auth";

const problemPage = ()=>{
 return(
    <div>
        Hello world!
    </div>
 )
}

export default problemPage;

export const getServerSideProps = updateUserInfo;
