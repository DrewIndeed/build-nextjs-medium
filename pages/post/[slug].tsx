import { GetStaticProps } from 'next'
import React from 'react'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Props {
  post: Post
}

function Post({ post }: Props) {
  console.log(post)
  return (
    <main className="mx-auto max-w-7xl scrollbar-hide">
      <Header />

      {/* Banner here */}
      <img
        className="h-60 w-full object-cover"
        src={urlFor(post.mainImage).url()}
        alt="detailed post main banner"
      />

      {/* Article here */}
      <article className="mx-auto my-5 max-w-5xl border border-y-0 border-x-2 border-green-200 px-10 py-8">
        {/* Title and Description */}
        <h1 className="mb-3 text-5xl font-bold ">{post.title}</h1>
        <h2 className="mb-3 text-lg italic text-gray-600">
          {post.description}
        </h2>

        {/* Article author and posted datetime */}
        <div className="mb-5 flex items-center space-x-3">
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
        <div>
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="my-5 text-xl font-bold" {...props} />
              ),
              h4: (props: any) => (
                <h4 className="my-3 text-justify" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),

              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
            imageOptions={{
              height: 500,
              width: 500,
            }}
          />
        </div>
      </article>

      <hr className="my-10 mx-auto max-w-3xl border-2 border-yellow-200" />

      {/* Comment section */}
      <form className="mx-auto mb-10 flex max-w-3xl flex-col p-5 duration-500 hover:shadow-2xl">
        <h3 className="text-md text-yellow-500">Enjoy this article</h3>
        <h4 className="font-bond text-3xl">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />

        <label className="mb-5 block">
          <span className="text-gray-600">Name</span>
          <input
            type="text"
            placeholder="Be here for a while"
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow focus:outline-yellow-200"
          />
        </label>

        <label className="mb-5 block">
          <span className="text-gray-600">Email</span>
          <input
            type="text"
            placeholder="Be here for a while"
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow focus:outline-yellow-200"
          />
        </label>

        <label className="mb-5 block">
          <span className="text-gray-600">Comment</span>
          <textarea
            style={{ resize: 'none' }}
            rows={8}
            placeholder="Be here for a while"
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow focus:outline-yellow-200"
          />
        </label>
      </form>
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
