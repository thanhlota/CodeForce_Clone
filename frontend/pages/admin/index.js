
import AdminLayout from "@/components/layout/AdminLayout"
import { authorizeAdmin } from "@/utils/auth";
import ContestTable from "@/components/contest/ContestTable";
import { useState, useCallback, useEffect, useRef } from "react";
import contestService from "@/services/contest.service";
import formatContest from "@/utils/formatContest";

const ContestListPage = () => {
  const [contests, setContests] = useState(null);
  const hasFetched = useRef(false);
  const fetchContests = useCallback(async () => {
    try {
      const res = await contestService.getContests();
      if (res.contests) {
        const contests = formatContest(res.contests);
        setContests(contests);
      }
    }
    catch (e) {
      console.log("ERROR", e);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchContests();
      hasFetched.current = true;
    }
  }, []);

  return (
    <AdminLayout>
      <ContestTable contests={contests} setContests={setContests} />
    </AdminLayout>
  )
};

export default ContestListPage;

export const getServerSideProps = authorizeAdmin;

