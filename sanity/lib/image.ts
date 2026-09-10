import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** OpenGraph kartları için 1200×630 URL döndürür. Kaynak yoksa undefined. */
export function urlForOpenGraph(source: SanityImageSource | undefined | null): string | undefined {
  if (!source) return undefined
  return builder.image(source).width(1200).height(630).auto('format').fit('crop').url()
}
