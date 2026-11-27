import { getInstagramPosts } from "@/lib/instagramFeed";
import InstagramCarousel from "@/components/InstagramCarousel";

// Server component: loads posts (cached 1h) and hands them to the client carousel.
export default async function InstagramReels() {
  const { items } = await getInstagramPosts();
  return <InstagramCarousel items={items} />;
}
