
export const createGroups = /* GraphQL */ `
mutation CreateGroups(
  $input: CreateGroupsInput!
  $condition: ModelGroupsConditionInput
) {
  createGroups(input: $input, condition: $condition) {
    id
    name
    type
    tax
    mem
    memId
    nickName
    createdAt
    updatedAt
  }
}
`;

export const updateGroups = /* GraphQL */ `
  mutation UpdateGroups(
    $input: UpdateGroupsInput!
    $condition: ModelGroupsConditionInput
  ) {
    updateGroups(input: $input, condition: $condition) {
      id
      name
      type
      tax
      mem
      memId
      nickName
      cuss {
        items {
          id
          displayName
          depositor
          createdAt
          updatedAt
          groupsCussId
        }
        nextToken
      }
      groupMem {
        items {
          id
          name
          createdAt
          updatedAt
          groupsGroupMemId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteGroups = /* GraphQL */ `
  mutation DeleteGroups(
    $input: DeleteGroupsInput!
    $condition: ModelGroupsConditionInput
  ) {
    deleteGroups(input: $input, condition: $condition) {
      id
      name
      type
      tax
      mem
      memId
      nickName
      cuss {
        items {
          id
          displayName
          depositor
          createdAt
          updatedAt
          groupsCussId
        }
        nextToken
      }
      groupMem {
        items {
          id
          name
          createdAt
          updatedAt
          groupsGroupMemId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;