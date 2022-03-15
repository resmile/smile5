export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        type
        cuss {
          nextToken
        }
        groupMem(sortDirection: DESC) {
           items {
                createdAt
                groupsGroupMemId
                id
                name
                updatedAt
          }
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

/*
groupMem(limit: 1, sortDirection: DESC) {
*/