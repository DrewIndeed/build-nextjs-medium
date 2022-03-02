import {
  createClient,
} from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2021-03-25',
  useCdn: process.env.NODE_ENV === 'production',
}

// Set up the ient for fetching data in the getProps page functions
export const sanityClient = createClient(config)

// Set up helper function for generating image URLs with only the asset reference data in your documents
export const urlFor = (source) => createImageUrlBuilder(config).image(source)
