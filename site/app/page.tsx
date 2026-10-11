import Script from "next/script";
import markup from "./landing-markup";
import ThreeHeroPendant from "./ThreeHeroPendant";

export default function Home() {
  return (
    <>
      <link rel="stylesheet" href="/landing.css" />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
      <ThreeHeroPendant />
      <Script src="/landing.js" strategy="afterInteractive" />
    </>
  );
}
