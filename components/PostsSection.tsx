import Link from 'next/link'
import { urlFor } from '../sanity.js'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

function PostSection({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post._id} href={`/post/${post.slug.current}`}>
          <div className="group cursor-pointer overflow-hidden rounded-lg border-2 duration-500 hover:shadow-2xl">
            {/* ! mark to ensure the scr is not null */}
            <img
              className="h-60 w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              src={urlFor(post.mainImage).url()!}
              alt="main post img"
            />

            <div className="flex justify-between bg-white p-5">
              <div>
                <p className="font-serif text-lg font-bold">{post.title}</p>
                <p className="font-serif text-xs">{post.description}</p>
              </div>

              <img
                className="h-12 w-12 rounded-full object-cover"
                src={urlFor(post.author.image).url()!}
                alt="main post img"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PostSection
