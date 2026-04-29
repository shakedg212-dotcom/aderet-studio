import fs from "node:fs";
import path from "node:path";
import Script from "next/script";

const homeBodyPath = path.join(process.cwd(), "content", "home-body.html");
const homeBody = fs.readFileSync(homeBodyPath, "utf8");

export default function HomePage() {
  return (
    <>
      <main dangerouslySetInnerHTML={{ __html: homeBody }} />
      <Script src="/legacy-home.js" strategy="afterInteractive" />
    </>
  );
}
