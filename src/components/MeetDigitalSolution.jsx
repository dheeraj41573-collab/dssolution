"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/meet-solution.css";

const INTRO = [
  "In today’s fast-evolving digital era, every business is concerned about its business growth, customers, social media followers, website optimization, ranking, and business app. These things are necessary and an integral part of businesses. Without the help of these tools, it is difficult to make a business grow digitally.",
  "A business’s online presence is key to success. Google, Microsoft Bing, and Yahoo Search are the major search engines; people use search engines to get information about anything, buy products and services, book tickets, etc. If you need more customers for your business, you need to make its online presence stronger.",
  "Business owners who understand this are already working on all these things and making their businesses more profitable. If you want to grow your business online, then you should, as soon as possible, also pay attention to your business and start your online journey.",
];

const TEAMS = [
  {
    title: "Why You Should Choose Digital Solution",
    text: "Digital Solution, also known as “The DS Solution,” is a top digital marketing and web development company in Mohali. We are specialists in providing the best digital solutions to businesses and helping them grow online and achieve their business goals faster. Also, we have good experience in creating successful roadmaps for your business.",
  },
  {
    title: "Highly Experienced Web Development Team",
    text: "We have a highly experienced team with extensive experience in the IT sector. Every team member has around 10 years of experience and a great understanding of customers’ needs. We can design and develop a perfect website for your business according to your requirements. Whether you need a Shopify website, a WordPress website, React, Node.js, etc., for your business.",
  },
  {
    title: "Highly Experienced Digital Marketing Team",
    text: "Our digital marketing experts have great experience and can help you get the No. 1 position in search engine rankings and increase website traffic. Social media is also helpful for businesses because billions of people use it. We can promote your business on these platforms and help it reach billions of people so that you can get leads and sales. Sponsored ads are also a very fast way of generating sales and leads. We can run sponsored ads and show them to your target audience in your target locations. Also, there are many more things we can do for you, like website optimization, on-page SEO, off-page SEO, Google Ads, Meta Ads, LinkedIn Ads, Local SEO, email marketing, business reviews, etc.",
  },
  {
    title: "Creative Graphic Design And Video Editing Team",
    text: "Our creative graphic designers can provide you with top-notch graphic design services, whether you need social media design, banner design for a website, logo design, ad creatives, or Figma design. No matter what you need, we will provide you with incredible graphic solutions. In today’s video era, people like to watch videos and reels. We can provide video editing services, reels, and motion graphics to promote your business on online platforms like YouTube, Facebook, Instagram, LinkedIn, and Threads, etc.",
  },
];

export default function MeetDigitalSolution() {
  const [open, setOpen] = useState(0);
  const [seen, setSeen] = useState(false);
  const steps = useRef(null);

  useEffect(() => {
    const el = steps.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      className="md-section relative py-16 xl:py-19"
      aria-labelledby="md-title"
    >
      <div className="mx-auto px-8 xl:max-w-330.5!">
        <h2 id="md-title" className="md-title">
          Meet <span>Digital Solution</span>
        </h2>

        <ol ref={steps} className={seen ? "md-steps in" : "md-steps"}>
          {INTRO.map((t, i) => (
            <li key={i} className={i === 2 ? "md-step last" : "md-step"}>
              <span className="md-node">0{i + 1}</span>
              <p>{t}</p>
            </li>
          ))}
        </ol>

        <div className="md-fan">
          {TEAMS.map((t, i) => {
            const on = open === i;
            return (
              <article
                key={t.title}
                className={on ? "md-pane on" : "md-pane"}
                onMouseEnter={() => setOpen(i)}
              >
                <span className="md-ghost" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="md-in">
                  <h3>
                    <button
                      type="button"
                      className="md-tab"
                      aria-expanded={on}
                      aria-controls={`md-body-${i}`}
                      onClick={() => setOpen(i)}
                      onFocus={() => setOpen(i)}
                    >
                      <span className="md-idx">0{i + 1}</span>
                      <span className="md-name">{t.title}</span>
                    </button>
                  </h3>
                  <div className="md-body" id={`md-body-${i}`}>
                    <div>
                      <p>{t.text}</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
