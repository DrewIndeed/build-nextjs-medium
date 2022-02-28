import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import PostSection from '../components/PostsSection'
import { sanityClient } from '../sanity.js'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

function Home({ posts }: Props) {
  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Blog with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <Banner />

      <PostSection posts={posts} />
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
