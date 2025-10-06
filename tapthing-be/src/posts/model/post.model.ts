export type PostDetail = {
  post: Post
  author: Author
  reactions: Reactions
}

export type Post = {
  id: string
  prompt_id: string
  storage_path: string
  created_at: string
  updated_at?: string
  country?: string
  city?: string
  lat?: number
  lng?: number
}

export type Author = {
  id: string
  username: string
  nome?: string
  cognome?: string
  bio?: string
  localita?: string
  avatar_url: string
}

export type Reactions = {
  byEmoji: ByEmoji[]
}

export type ByEmoji = {
  emoji_id: number
  shortcode: 'pollice_su' | 'pollice_giu' | 'cuore'
  unicode: 'pollice_su' | 'pollice_giu' | 'cuore'
  label: 'Pollice su' | 'Pollice giù' | 'Cuore'
  count: number
}


export type ResponsePostPaginated = {
  posts: PostDetail[]
  nextCursor: {
    id: string | null,
    created_at: string | null
  } | null
}