import Menu from "@/components/Menu/Menu";
import { Metadata } from "next";
import Image from 'next/image'
import Link from "next/link";

export const metadata: Metadata = {
    metadataBase: new URL('https://mccreations.net'),
    title: "Wix is Over Giveaway | MCCreations",
    description: "Submit your Minecraft Map, Data Pack or Resource Pack for a chance to win up to $1000 throughout the month of September! There are also another $1000 in bonus prizes. MCCreations Wix is Over Giveaway.",
    twitter: {
      title: "Wix is Over Giveaway | MCCreations",
      description: "Submit your Minecraft Map, Data Pack or Resource Pack for a chance to win up to $1000 throughout the month of September!",
      card: "summary_large_image",
      images: [
        "https://mccreations.net/wix-is-over.jpg"
      ]
    },
    openGraph: {
      title: "Wix is Over Giveaway | MCCreations",
      description: "Submit your Minecraft Map, Data Pack or Resource Pack for a chance to win up to $1000 throughout the month of September!",
      images: [
        "https://mccreations.net/wix-is-over.jpg"
      ],
      siteName: "MCCreations",
      type: "website",
      url: "https://mccreations.net/events/wix-is-over"
    }
  }

export default function Page() {
    return (
        <>
        <Menu selectedPage="events" />
        <div className="centered_content">
            <Image src="/wix-is-over.jpg" style={{width: "100%", height: "auto"}} width={1920} height={1080} alt="Submit your map for $1000 plus another $1000 in bonus prizes. MCCreations Wix is Over Giveaway."/>
            <div className="centered_content">
                <h1>Info</h1>
                <p>In celebration of the deprication of the Wix site and the basically full launch of the new site we're doing a massive giveaway! Why? Because we hate money! All that sweet cash we're saving by moving away from Wix, pffft lets give it away instead. More accurately, we love you more than money :p.</p>
                <h2>Prizes</h2>
                <ol>
                    <li>First Prize: $1,000 cash</li>
                    <li>Second Prize: $500 cash</li>
                    <li>Third Prize: $250 cash</li>
                    <li>Fourth Prize: $100 cash</li>
                    <li>Fifth Prize: $50 cash</li>
                    <li>6th-10th Prize: $20 cash</li>
                </ol>
                <h2>How to Enter</h2>
                <p>In order to enter the giveaway, you must submit a new piece of content to MCCreations that is for Minecraft 1.20+ using an MCCreations account (so we can get a hold of you later!). That means you could submit a map for Minecraft 1.21 or a resourcepack for  Minecraft 1.20 or anything in between! By new, we just mean it hasn't been on MCCreations before, it's a-ok to submit content that is published elsewhere (although entirely new stuff is super awesome).</p>
                <h2>Dates</h2>
                <p>Any content submitted and requested for approval between September 1st and September 30th will be eligible as long as it gets approved. This means that your content does need to be approved to be eligible, but if you hit that request approval button on September 30th but your content is not approved until October you are still eligible!</p>
                <p>And that's all, happy creating! Feel free to message me on our <Link href="https://discord.com/invite/HQSnKGf">Discord Server</Link> or through DM (@crazycowmm) or email <Link href="mailto:crazycowmm@gmail.com">crazycowmm@gmail.com</Link> if you have questions!</p>
                <p>~ Ben Meier/CrazyCowMM</p>
            </div>
        </div>
        </>
    )
}