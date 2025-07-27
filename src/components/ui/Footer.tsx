import DisclaimerModal from "./DisclaimerModal";
import HiddenFileDrop from "./HiddenFileDrop";
import { memo } from "react";

const Footer = memo(function Footer() {
  return (
    <>
      <style>{`
        .footer-bg-text {
          position: relative;
          z-index: 1;
          overflow: hidden;
        }
        .footer-bg-bgtext {
          position: absolute;
          top: -6px;
          left: 0;
          width: 100%;
          
          // height: 3rem;
          overflow: hidden;
          font-family: 'NBit', sans-serif;
          font-size: 1.2rem;
          color: var(--color-neutral-100);
          opacity: 0.69;
          white-space: nowrap;
          z-index: -4;
          pointer-events: none;
          overflow: hidden;
          // padding: 0.5rem;
        }
        .footer-bg-bgtext-1 {
          position: absolute;
          top: -13px;
          left: 0;
          width: 100%;
          line-height: 0.69;
          overflow: hidden;
          font-family: 'NBit', sans-serif;
          font-size: 1.2rem;
          color: var(--color-neutral-100);
          opacity: 0.05;
          // white-space: nowrap;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          // padding: 0.5rem;
        }
      `}</style>
      <div
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
        className="footer-bg-text fade-in-footer fixed bottom-0 left-0 right-0 z-10 flex w-full items-center justify-between bg-gray-700 px-2 ring md:relative md:bottom-auto"
      >
        <div className="footer-bg-bgtext-1 leading-none">
          {"  "} LFG 1.3 LFG 1.3 LFG1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LF G 1.3 LFG 1.3 LFG i heard u
          can fuck May in 1.4 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 GOATDINOLFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1. 3 LFG 1.3 LFG GIVE blaziken speed boost back
          cmon1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1. 3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LF G 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LF G 1. 1.3 LFG 1.3 LFG 1.3 LFG 1.3 1.3 LFG 1.3 LFG 1.3 LF G
          1.3 LF G 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG I HEARD
           LFG 1.3 LFG1.3 LFG 1.3 LFG 1.3 LFG 1.3 1.3 LFG 1. 3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3
          OH WOW LOOK AT YOU PROFFESOR INSPECT ELEMENT, LITTLE CURIOUS HUH WELL SINCE YOUR HERE LET ME TELL U SOMETHING I HEARD
         THEY'RE GONNA LET U FUCK DAWN in 1.4 BUT I DONT KNOWWW THAT THATS JUST WHAT THEY'RE
          TALKING ABOUT I MEAN I THINK ITS DISGUSTING OF COURSE BUT I MEAN I THINK ITD BE
          SORTA COOL YA KNOW IDK LIKE IN A ART-NEUVO WAY OR MAYBE HES MAKING IT A VISUAL NOVEL OR SOMETHING I MEAN YEAH SHES A CHILD AND THATS NASTY AND SICK AND THOSE PEOPLE SHOULD LIKE BE IN PRISON OR IN THERAPY AND HAVE DAILY-CHECKINS AND WHATEVER
           BUT I MEAN I THINK ITD BE SORTA cool IF ITS REAL AGAIN I DON'T KNOW THAT
          LFG 1.3 LFG 1.3 LFG 1.3 GOATDINOLFG 1.3 LFG 1.3 LFG 1.3 LFG 1.3 LFG
          1.3 LFG 1.3 LFjk FUCK BLAZIKEN
        </div>
        {/* ...existing code... */}
        <div className="font-pkmnem pkmnem-face-shadow text-sm/3 text-neutral-100">
          <p>
            {" "}
            Dex by{" "}
            <a
              className="underline hover:bg-gray-600"
              href="https://dex.emeraldimperium.net/"
            >
              Kildemal
            </a>
          </p>
          <p>
            <a
              href="https://www.youtube.com/watch?v=Vhh_GeBPOhs"
              target="_blank"
            >
              Map by Specker ☻
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:w-80">
          <HiddenFileDrop />
          <p className="font-pkmnem leading-xs text-sm/3 text-white">
            1.3 FRIDAY!!! LETS F*UCKINNN OGGOOOOO! ! ! ! ! ! ! ! ! !
          </p>
        </div>
        <div className="flex items-center justify-end gap-5">
          <div className="md:w-full">
            {/* <p className="font-pkmnem leading-xs text-sm/3 text-white">
              Not developed by the Emerald Imperium team.
            </p> */}
            <p className="font-pkmnem leading-xs pr-1 text-sm/3 text-white">
              <DisclaimerModal />
            </p>
          </div>
        </div>
      </div>
    </>
  );
});

export default Footer;
