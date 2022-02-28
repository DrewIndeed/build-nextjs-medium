import Head from 'next/head'
import Link from 'next/link'
import Banner from '../components/Banner'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity.js'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

function Home({ posts }: Props) {
  console.log(posts)
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Banner />

      {/* Post here */}
      <div className="lg:grid-cols-3 grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer overflow-hidden rounded-lg border-2">
              {/* ! mark to ensure the scr is not null */}
              <img
                className="duration-400 h-60 w-full object-cover transition-transform ease-in-out group-hover:scale-105"
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
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const query = `*[_type == 'post']{
    _id,
    title,
    author -> {name, image},
    description, 
    mainImage,
    slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
