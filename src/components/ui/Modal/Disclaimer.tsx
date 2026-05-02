import { animated, useTrail, config } from "@react-spring/web";

import { ErrorBoundary } from "react-error-boundary";

// THESE ARE REVERSED BECAUSE REACT-SPRING IS BUGGY
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paragraphs = (springAnim: any, index: number) => {
  const pars = [
    <animated.div
      style={springAnim}
      className="font-pkmnem leading-tight"
      key="par8"
    >
      <h3>
        <strong>
          This project is not officially endorsed, sponsored, or affiliated
          with:
        </strong>
      </h3>
      <ul className="list-disc pl-6">
        <li>The Pokémon Company International</li>
        <li>Nintendo Co., Ltd.</li>
        <li>Game Freak Inc.</li>
        <li>Creatures Inc.</li>
      </ul>

      <p>
        Pokémon and all related characters, names, marks, and logos are
        trademarks of Nintendo, Game Freak, and The Pokémon Company.
      </p>

      <p>
        This tool is provided for educational and informational purposes only.
        All game data and information is used under fair use principles.
      </p>
    </animated.div>,
    <animated.div style={springAnim} key="par7">
      <p>
        For projects <em>I&apos;d</em> endorse, checkout Kildemal&#39;s{" "}
        <a
          href="https://dex.emeraldimperium.net"
          className="underline hover:text-blue-200"
        >
          Official Pokédex
        </a>{" "}
        and iamguitar&#39;s{" "}
        <a
          href="https://emeraldimperium.info/"
          className="underline hover:text-blue-200"
        >
          Pokémon Emerald Imperium Homepage.
        </a>
      </p>
      <p>
        I got the map image from{" "}
        <a
          href="https://www.deviantart.com/jaime07/art/Hoenn-Map-HD-464622982"
          className="underline hover:text-blue-200"
        >
          Jamie07&#39;s DeviantArt
        </a>
      </p>
    </animated.div>,
    <animated.div style={springAnim} key="par6">
      <p className="font-calamity text-sm">
        The source of truth is the Discord and the Pokecommunity post. Stay
        sharp.
      </p>
      <hr />
    </animated.div>,
    <animated.p style={springAnim} key="par5">
      Further, their profits from ads could bring unwanted attention to our
      community from Nintendo. These are malicous, leechful, and explotative
      actors putting the community they prey on at risk.
    </animated.p>,
    <animated.p style={springAnim} key="par4">
      Anyone else claiming to be the official site is <strong>lying</strong>.
      They&#39;re trying to make money on ads and as a result, give fans like us
      bad names!
    </animated.p>,
    <animated.p style={springAnim} key="par3">
      The official site for Emerald Imperium is{" "}
      <a
        href="https://emeraldimperium.net"
        className="underline hover:text-blue-200"
      >
        emeraldimperium.net
      </a>
      .
    </animated.p>,

    <animated.p style={springAnim} key="par1">
      This project gets the item locations from the{" "}
      <a
        className="underline hover:text-blue-200"
        href="https://github.com/iriv24/pokeemerald-expansion"
        target="_blank"
        rel="noreferrer"
      >
        Emerald Imperium Github repository
      </a>{" "}
      using a parser called{" "}
      <a
        href="https://github.com/Sp3cker/spory-sparser"
        target="_blank"
        rel="noreferrer"
        className="underline hover:text-blue-200"
      >
        SporySparser.
      </a>{" "}
      <br />
      Species & Trainer data is pulled using a fork of
      <br />
      <a
        className="underline hover:text-blue-200"
        href="https://github.com/lhearachel/porydex"
      >
        LheaRachel&apos;s Porydex
      </a>
      .
      <br /> If you find an error in the data, please report it in the EI
      Discord.
    </animated.p>,
  ];
  return pars[index];
};
const Disclaimer = () => {
  const wordSprings = useTrail(8, {
    from: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    to: { opacity: 1, clipPath: "inset(0 0% 0 0)" },
    delay: 20,
    reverse: false,

    config: (key: string) =>
      key === "opacity" ? { clamp: true } : config.stiff,
  });

  return (
    <>
      <h2 className="font-calamity mb-4 text-xl font-bold text-gray-200">
        Disclaimer
      </h2>
      <ErrorBoundary fallback={<p>whoopsie</p>}>
        <div className="font-calamity space-y-2.5 text-xs/5 text-gray-300 sm:text-sm/5">
          {wordSprings
            .slice()
            .reverse()
            .map((springAnim, index) => paragraphs(springAnim, 7 - index))}
        </div>
      </ErrorBoundary>
    </>
  );
};

export default Disclaimer;
