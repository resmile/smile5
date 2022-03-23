/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBlog = /* GraphQL */ `
  query GetBlog($id: ID!) {
    getBlog(id: $id) {
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
export const listBlogs = /* GraphQL */ `
  query ListBlogs(
    $filter: ModelBlogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBlogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        post {
          id
          title
          createdAt
          updatedAt
          blogPostsId
        }
        content
        createdAt
        updatedAt
        postCommentsId
      }
      nextToken
    }
  }
`;
export const getProd = /* GraphQL */ `
  query GetProd($id: ID!) {
    getProd(id: $id) {
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
export const listProds = /* GraphQL */ `
  query ListProds(
    $filter: ModelProdFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getStock = /* GraphQL */ `
  query GetStock($id: ID!) {
    getStock(id: $id) {
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
export const listStocks = /* GraphQL */ `
  query ListStocks(
    $filter: ModelStockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        prodStockId
      }
      nextToken
    }
  }
`;
export const getPurchas = /* GraphQL */ `
  query GetPurchas($id: ID!) {
    getPurchas(id: $id) {
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
export const listPurchas = /* GraphQL */ `
  query ListPurchas(
    $filter: ModelPurchasFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPurchas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        prodPurchasId
      }
      nextToken
    }
  }
`;
export const getGroups = /* GraphQL */ `
  query GetGroups($id: ID!) {
    getGroups(id: $id) {
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
        tax
        mem
        memId
        nickName
        cuss {
          nextToken
        }
        groupMem {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGroupMem = /* GraphQL */ `
  query GetGroupMem($id: ID!) {
    getGroupMem(id: $id) {
      id
      name
      groups {
        id
        name
        type
        tax
        mem
        memId
        nickName
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
export const listGroupMems = /* GraphQL */ `
  query ListGroupMems(
    $filter: ModelGroupMemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroupMems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        groups {
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
        createdAt
        updatedAt
        groupsGroupMemId
      }
      nextToken
    }
  }
`;
export const getNotis = /* GraphQL */ `
  query GetNotis($id: ID!) {
    getNotis(id: $id) {
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
export const listNotis = /* GraphQL */ `
  query ListNotis(
    $filter: ModelNotisFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotis(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getCuss = /* GraphQL */ `
  query GetCuss($id: ID!) {
    getCuss(id: $id) {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
export const listCusses = /* GraphQL */ `
  query ListCusses(
    $filter: ModelCussFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCusses(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
