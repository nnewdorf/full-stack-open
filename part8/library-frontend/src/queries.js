import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors{
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query ($genre: String){
    allBooks (genre: $genre){
      title
      author{
        name
      }
      published
      genres
    }
  }
`

export const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`