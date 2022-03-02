import { GetStaticProps } from 'next'
import React from 'react'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { useForm, SubmitHandler } from 'react-hook-form'

// declare the form template to pass in useForm the let the form knows it only had these types
interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface Props {
  post: Post
}

function Post({ post }: Props) {
  console.log(post)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => console.log(data))
      .catch((err) => console.log(err))
  }

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto mb-10 flex max-w-3xl flex-col p-5 duration-500 hover:shadow-2xl"
      >
        <h3 className="text-md text-yellow-500">Enjoy this article</h3>
        <h4 className="font-bond text-3xl">Leave a comment below!</h4>
        <hr className="mt-2 py-3" />

        <input type="hidden" value={post._id} {...register('_id')} />

        <label className="mb-5 block">
          <span className="text-gray-600">Name</span>
          <input
            {...register('name', { required: true })}
            type="text"
            placeholder="Fill in your name"
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow focus:outline-yellow-200"
          />
        </label>

        <label className="mb-5 block">
          <span className="text-gray-600">Email</span>
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Fill in your email"
            className="form-input mt-1 block w-full rounded border py-2 px-3 shadow focus:outline-yellow-200"
          />
        </label>

        <label className="mb-5 block">
          <span className="text-gray-600">Comment</span>
          <textarea
            {...register('comment', { required: true })}
            style={{ resize: 'none' }}
            rows={8}
            placeholder="What would you like to let me know?"
            className="form-textarea mt-1 block w-full rounded border py-2 px-3 shadow focus:outline-yellow-200"
          />
        </label>

        {/* handle failed validation here */}
        <div className="flex flex-col p-5">
          {errors.name && (
            <span className="text-red-500">- Name is required</span>
          )}
          {errors.email && (
            <span className="text-red-500">- Email is required</span>
          )}
          {errors.comment && (
            <span className="text-red-500">- Comment is required</span>
          )}
        </div>

        {/* submit button */}
        <input
          type="submit"
          className="focus:shadow-outline cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:bg-yellow-400 focus:outline-none"
        />
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
