import CreatePostCard from "@/components/Posts/CreatePostCard";
import PostFeed from "@/components/Posts/PostFeed";
import SuggestedUsers from "@/components/SuggestedUsers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser()

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
      <section className="col-span-7 flex max-h-[calc(100vh-100px)] flex-col gap-6 overflow-y-scroll">
          {user && <CreatePostCard/>}
          <PostFeed/>
      </section>
      <section className="lg:col-span-3">
        <SuggestedUsers/>
      </section>
    </div>
  );
}
