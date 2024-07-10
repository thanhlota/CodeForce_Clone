import { updateUserInfo } from "@/utils/auth";
import styles from "@/styles/home.module.css";
import contestImg from "@/public/images/contestImg.png";
import Image from 'next/image';
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.part1}>
        <div className={styles.leftDiv}>
          <h1 className={styles.title}>High quality and fun
            <span className={styles.text_hl}> programming contests </span>
            for everyone</h1>
          <p className={styles.text}>
            Participate in HustCode Programming contests to challenge yourself with some inspiring competitive programming problems and see your ranking.
          </p>
          <p className={styles.text}>
            See the current contests and get some training problems by hitting the button below
          </p>
          <div className={styles.action_wrapper}>
            <button className={styles.ctaButton} onClick={() => router.push("/contests")}>Current contests</button>
            <button className={styles.ctaButton} onClick={() => router.push("/problems")}>Training</button>
          </div>
        </div>
        <div className={styles.rightDiv}>
          <Image className={styles.image} src={contestImg} alt="Contest" />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = updateUserInfo;

