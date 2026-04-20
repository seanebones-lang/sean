import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    bookingUrl,
    depositPaymentUrl,
    instagramUrl,
    facebookUrl,
    contactEmail
  }
`;

export const featuredPortfolioQuery = groq`
  *[_type == "portfolioPiece" && featured == true] | order(_createdAt desc)[0...9]{
    _id,
    title,
    "slug": slug.current,
    styleTags,
    images
  }
`;

/** All published portfolio pieces (newest / featured first). */
export const portfolioListQuery = groq`
  *[_type == "portfolioPiece"] | order(coalesce(featured, false) desc, _updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    styleTags,
    featured,
    images
  }
`;

/** Single portfolio piece by slug. */
export const portfolioPieceBySlugQuery = groq`
  *[_type == "portfolioPiece" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    styleTags,
    featured,
    images,
    healedImage,
    publishedAt,
    "artist": artist->{
      name,
      "slug": slug.current,
      profileImage,
      specialties,
      availabilityStatus
    }
  }
`;

/** Related portfolio pieces by overlapping style tags. */
export const relatedPiecesQuery = groq`
  *[_type == "portfolioPiece" && slug.current != $slug && count((styleTags)[@ in $tags]) > 0] | order(_updatedAt desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    styleTags,
    images
  }
`;

/** All portfolio piece slugs for sitemap + static generation. */
export const portfolioSlugsQuery = groq`
  *[_type == "portfolioPiece" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`;

/** All artist slugs for sitemap + static generation. */
export const artistSlugsQuery = groq`
  *[_type == "artist" && defined(slug.current)]{
    "slug": slug.current,
    _updatedAt
  }
`;

/** Single artist profile by slug with their portfolio pieces. */
export const artistBySlugQuery = groq`
  *[_type == "artist" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    profileImage,
    coverImage,
    bio,
    yearsExperience,
    specialties,
    availabilityStatus,
    pricing,
    studioInfo,
    socials,
    isSponsored,
    certifications,
    languages,
    consultationRequired,
    acceptedPayments,
    "featuredPieces": featuredPieces[]->{
      _id,
      title,
      "slug": slug.current,
      images,
      styleTags
    },
    "portfolioPieces": *[_type == "portfolioPiece" && references(^._id)] | order(coalesce(featured, false) desc, _updatedAt desc){
      _id,
      title,
      "slug": slug.current,
      images,
      styleTags,
      featured
    }
  }
`;

/** All artists list. */
export const artistListQuery = groq`
  *[_type == "artist"] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    profileImage,
    specialties,
    availabilityStatus,
    isSponsored,
    "pieceCount": count(*[_type == "portfolioPiece" && references(^._id)])
  }
`;
