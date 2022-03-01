import { GetStaticProps } from 'next'
import React from 'react'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'

interface Props {
  post: Post
}

function Post({ post }: Props) {
  console.log(post)
  return (
    <main className="mx-auto max-w-7xl">
      <Header />

      {/* Banner here */}
      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt="detailed post main banner"
      />

      {/* Article here */}
      <article className="mx-auto mt-5 max-w-3xl border border-y-0 border-x-2 p-8">
        {/* Title and Description */}
        <h1 className="mb-3 text-5xl font-bold ">{post.title}</h1>
        <h2 className="mb-3 text-lg italic text-gray-600">
          {post.description}
        </h2>

        {/* Article author and posted datetime */}
        <div className="flex items-center space-x-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={urlFor(post.author.image).url()}
            alt="author in detailed post"
          />
          <p className="text-xs italic text-gray-500">
            Posted by <span className="font-bold">{post.author.name}</span> at{' '}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        {/* Article body */}
      </article>
    </main>
  )
}

export default Post

// find the paths that pages actually exist
export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
    _id,
    slug {
    current
   }
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == 'post' && slug.current == $slug][0]{
    _id,
    _createdAt,
    author -> {name, image},
    title,
  description,
  mainImage,
  slug,
  body
  }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  })

  // if no post came back
  if (!post) {
    return { notFound: true } // 404 Not Found page
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60s, it will update the old cached version
  }
}
