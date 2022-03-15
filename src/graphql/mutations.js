/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBlog = /* GraphQL */ `
  mutation CreateBlog(
    $input: CreateBlogInput!
    $condition: ModelBlogConditionInput
  ) {
    createBlog(input: $input, condition: $condition) {
      id
      name
      posts {
        items {
          id
          title
          createdAt
          updatedAt
          blogPostsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateBlog = /* GraphQL */ `
  mutation UpdateBlog(
    $input: UpdateBlogInput!
    $condition: ModelBlogConditionInput
  ) {
    updateBlog(input: $input, condition: $condition) {
      id
      name
      posts {
        items {
          id
          title
          createdAt
          updatedAt
          blogPostsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteBlog = /* GraphQL */ `
  mutation DeleteBlog(
    $input: DeleteBlogInput!
    $condition: ModelBlogConditionInput
  ) {
    deleteBlog(input: $input, condition: $condition) {
      id
      name
      posts {
        items {
          id
          title
          createdAt
          updatedAt
          blogPostsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      title
      blog {
        id
        name
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          createdAt
          updatedAt
          postCommentsId
        }
        nextToken
      }
      createdAt
      updatedAt
      blogPostsId
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      title
      blog {
        id
        name
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          createdAt
          updatedAt
          postCommentsId
        }
        nextToken
      }
      createdAt
      updatedAt
      blogPostsId
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      title
      blog {
        id
        name
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      comments {
        items {
          id
          content
          createdAt
          updatedAt
          postCommentsId
        }
        nextToken
      }
      createdAt
      updatedAt
      blogPostsId
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      post {
        id
        title
        blog {
          id
          name
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
        blogPostsId
      }
      content
      createdAt
      updatedAt
      postCommentsId
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      post {
        id
        title
        blog {
          id
          name
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
        blogPostsId
      }
      content
      createdAt
      updatedAt
      postCommentsId
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      post {
        id
        title
        blog {
          id
          name
          createdAt
          updatedAt
        }
        comments {
          nextToken
        }
        createdAt
        updatedAt
        blogPostsId
      }
      content
      createdAt
      updatedAt
      postCommentsId
    }
  }
`;
export const createProd = /* GraphQL */ `
  mutation CreateProd(
    $input: CreateProdInput!
    $condition: ModelProdConditionInput
  ) {
    createProd(input: $input, condition: $condition) {
      prodNo
      prodName
      setId
      setVol
      setName
      cateNo
      cateName
      isVat
      isSale
      warehNo
      warehName
      suppNo
      suppName
      currStock
      currPrice
      prevPrice
      stock {
        items {
          id
          typeName
          stock
          prevStock
          afterStock
          memo
          createdAt
          updatedAt
          prodStockId
        }
        nextToken
      }
      purchas {
        items {
          id
          purchasePrice
          suppNo
          suppName
          createdAt
          updatedAt
          prodPurchasId
        }
        nextToken
      }
      id
      createdAt
      updatedAt
    }
  }
`;
export const updateProd = /* GraphQL */ `
  mutation UpdateProd(
    $input: UpdateProdInput!
    $condition: ModelProdConditionInput
  ) {
    updateProd(input: $input, condition: $condition) {
      prodNo
      prodName
      setId
      setVol
      setName
      cateNo
      cateName
      isVat
      isSale
      warehNo
      warehName
      suppNo
      suppName
      currStock
      currPrice
      prevPrice
      stock {
        items {
          id
          typeName
          stock
          prevStock
          afterStock
          memo
          createdAt
          updatedAt
          prodStockId
        }
        nextToken
      }
      purchas {
        items {
          id
          purchasePrice
          suppNo
          suppName
          createdAt
          updatedAt
          prodPurchasId
        }
        nextToken
      }
      id
      createdAt
      updatedAt
    }
  }
`;
export const deleteProd = /* GraphQL */ `
  mutation DeleteProd(
    $input: DeleteProdInput!
    $condition: ModelProdConditionInput
  ) {
    deleteProd(input: $input, condition: $condition) {
      prodNo
      prodName
      setId
      setVol
      setName
      cateNo
      cateName
      isVat
      isSale
      warehNo
      warehName
      suppNo
      suppName
      currStock
      currPrice
      prevPrice
      stock {
        items {
          id
          typeName
          stock
          prevStock
          afterStock
          memo
          createdAt
          updatedAt
          prodStockId
        }
        nextToken
      }
      purchas {
        items {
          id
          purchasePrice
          suppNo
          suppName
          createdAt
          updatedAt
          prodPurchasId
        }
        nextToken
      }
      id
      createdAt
      updatedAt
    }
  }
`;
export const createStock = /* GraphQL */ `
  mutation CreateStock(
    $input: CreateStockInput!
    $condition: ModelStockConditionInput
  ) {
    createStock(input: $input, condition: $condition) {
      id
      typeName
      stock
      prevStock
      afterStock
      memo
      prod {
        prodNo
        prodName
        setId
        setVol
        setName
        cateNo
        cateName
        isVat
        isSale
        warehNo
        warehName
        suppNo
        suppName
        currStock
        currPrice
        prevPrice
        stock {
          nextToken
        }
        purchas {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      prodStockId
    }
  }
`;
export const updateStock = /* GraphQL */ `
  mutation UpdateStock(
    $input: UpdateStockInput!
    $condition: ModelStockConditionInput
  ) {
    updateStock(input: $input, condition: $condition) {
      id
      typeName
      stock
      prevStock
      afterStock
      memo
      prod {
        prodNo
        prodName
        setId
        setVol
        setName
        cateNo
        cateName
        isVat
        isSale
        warehNo
        warehName
        suppNo
        suppName
        currStock
        currPrice
        prevPrice
        stock {
          nextToken
        }
        purchas {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      prodStockId
    }
  }
`;
export const deleteStock = /* GraphQL */ `
  mutation DeleteStock(
    $input: DeleteStockInput!
    $condition: ModelStockConditionInput
  ) {
    deleteStock(input: $input, condition: $condition) {
      id
      typeName
      stock
      prevStock
      afterStock
      memo
      prod {
        prodNo
        prodName
        setId
        setVol
        setName
        cateNo
        cateName
        isVat
        isSale
        warehNo
        warehName
        suppNo
        suppName
        currStock
        currPrice
        prevPrice
        stock {
          nextToken
        }
        purchas {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      prodStockId
    }
  }
`;
export const createPurchas = /* GraphQL */ `
  mutation CreatePurchas(
    $input: CreatePurchasInput!
    $condition: ModelPurchasConditionInput
  ) {
    createPurchas(input: $input, condition: $condition) {
      id
      purchasePrice
      suppNo
      suppName
      prod {
        prodNo
        prodName
        setId
        setVol
        setName
        cateNo
        cateName
        isVat
        isSale
        warehNo
        warehName
        suppNo
        suppName
        currStock
        currPrice
        prevPrice
        stock {
          nextToken
        }
        purchas {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      prodPurchasId
    }
  }
`;
export const updatePurchas = /* GraphQL */ `
  mutation UpdatePurchas(
    $input: UpdatePurchasInput!
    $condition: ModelPurchasConditionInput
  ) {
    updatePurchas(input: $input, condition: $condition) {
      id
      purchasePrice
      suppNo
      suppName
      prod {
        prodNo
        prodName
        setId
        setVol
        setName
        cateNo
        cateName
        isVat
        isSale
        warehNo
        warehName
        suppNo
        suppName
        currStock
        currPrice
        prevPrice
        stock {
          nextToken
        }
        purchas {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      prodPurchasId
    }
  }
`;
export const deletePurchas = /* GraphQL */ `
  mutation DeletePurchas(
    $input: DeletePurchasInput!
    $condition: ModelPurchasConditionInput
  ) {
    deletePurchas(input: $input, condition: $condition) {
      id
      purchasePrice
      suppNo
      suppName
      prod {
        prodNo
        prodName
        setId
        setVol
        setName
        cateNo
        cateName
        isVat
        isSale
        warehNo
        warehName
        suppNo
        suppName
        currStock
        currPrice
        prevPrice
        stock {
          nextToken
        }
        purchas {
          nextToken
        }
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      prodPurchasId
    }
  }
`;


export const createGroups = /* GraphQL */ `
  mutation CreateGroups(
    $input: CreateGroupsInput!
    $condition: ModelGroupsConditionInput
  ) {
    createGroups(input: $input, condition: $condition) {
      id
      name
      type
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
export const updateGroups = /* GraphQL */ `
  mutation UpdateGroups(
    $input: UpdateGroupsInput!
    $condition: ModelGroupsConditionInput
  ) {
    updateGroups(input: $input, condition: $condition) {
      id
      name
      type
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
export const createGroupMem = /* GraphQL */ `
  mutation CreateGroupMem(
    $input: CreateGroupMemInput!
    $condition: ModelGroupMemConditionInput
  ) {
    createGroupMem(input: $input, condition: $condition) {
      id
      name
      groups {
        id
        name
        type
        cuss {
          nextToken
        }
        groupMem {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      groupsGroupMemId
    }
  }
`;
export const updateGroupMem = /* GraphQL */ `
  mutation UpdateGroupMem(
    $input: UpdateGroupMemInput!
    $condition: ModelGroupMemConditionInput
  ) {
    updateGroupMem(input: $input, condition: $condition) {
      id
      name
      groups {
        id
        name
        type
        cuss {
          nextToken
        }
        groupMem {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      groupsGroupMemId
    }
  }
`;
export const deleteGroupMem = /* GraphQL */ `
  mutation DeleteGroupMem(
    $input: DeleteGroupMemInput!
    $condition: ModelGroupMemConditionInput
  ) {
    deleteGroupMem(input: $input, condition: $condition) {
      id
      name
      groups {
        id
        name
        type
        cuss {
          nextToken
        }
        groupMem {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      groupsGroupMemId
    }
  }
`;
export const createNotis = /* GraphQL */ `
  mutation CreateNotis(
    $input: CreateNotisInput!
    $condition: ModelNotisConditionInput
  ) {
    createNotis(input: $input, condition: $condition) {
      id
      title
      body
      files
      name
      createBy
      state
      stateName
      createdAt
      updatedAt
    }
  }
`;
export const updateNotis = /* GraphQL */ `
  mutation UpdateNotis(
    $input: UpdateNotisInput!
    $condition: ModelNotisConditionInput
  ) {
    updateNotis(input: $input, condition: $condition) {
      id
      title
      body
      files
      name
      createBy
      state
      stateName
      createdAt
      updatedAt
    }
  }
`;
export const deleteNotis = /* GraphQL */ `
  mutation DeleteNotis(
    $input: DeleteNotisInput!
    $condition: ModelNotisConditionInput
  ) {
    deleteNotis(input: $input, condition: $condition) {
      id
      title
      body
      files
      name
      createBy
      state
      stateName
      createdAt
      updatedAt
    }
  }
`;
export const createCuss = /* GraphQL */ `
  mutation CreateCuss(
    $input: CreateCussInput!
    $condition: ModelCussConditionInput
  ) {
    createCuss(input: $input, condition: $condition) {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
export const updateCuss = /* GraphQL */ `
  mutation UpdateCuss(
    $input: UpdateCussInput!
    $condition: ModelCussConditionInput
  ) {
    updateCuss(input: $input, condition: $condition) {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
export const deleteCuss = /* GraphQL */ `
  mutation DeleteCuss(
    $input: DeleteCussInput!
    $condition: ModelCussConditionInput
  ) {
    deleteCuss(input: $input, condition: $condition) {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
