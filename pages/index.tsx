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
  console.log(posts);
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Banner />

      {/* Post here */}
      <div>
        {posts.map(post => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div>
              {/* ! mark to ensure the scr is not null */}
              <img src={ urlFor(post.mainImage).width(500).height(300).url()! } alt="main post img" />
            </div>
          </Link>
        )) }
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
