const typeDefs = `
 type Address {
  street: String!
  city: String!
}

type Person {
  name: String!
  phone: String
  address: Address!
  id: ID!
}

type User{
username: String!,
friends: [Person!]!,
id: ID!
}

type Token{
value: String!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
  me: User
  allUsers: [User!]!
}

type Mutation{
  addPerson(
  name: String!
  phone: String
  city: String!
  street: String!
  ): Person!

  editNumber(
  name: String!,
  phone: String!
  ): Person!

  createUser(
  username: String!
  ): User!

  login(
  username: String!
  password: String!
  ): Token

  addAsFriend(
  name: String!
  ): User!
}
`

module.exports = typeDefs;