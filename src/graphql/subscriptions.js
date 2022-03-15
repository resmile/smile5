/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateBlog = /* GraphQL */ `
  subscription OnCreateBlog {
    onCreateBlog {
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
export const onUpdateBlog = /* GraphQL */ `
  subscription OnUpdateBlog {
    onUpdateBlog {
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
export const onDeleteBlog = /* GraphQL */ `
  subscription OnDeleteBlog {
    onDeleteBlog {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateProd = /* GraphQL */ `
  subscription OnCreateProd {
    onCreateProd {
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
export const onUpdateProd = /* GraphQL */ `
  subscription OnUpdateProd {
    onUpdateProd {
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
export const onDeleteProd = /* GraphQL */ `
  subscription OnDeleteProd {
    onDeleteProd {
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
export const onCreateStock = /* GraphQL */ `
  subscription OnCreateStock {
    onCreateStock {
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
export const onUpdateStock = /* GraphQL */ `
  subscription OnUpdateStock {
    onUpdateStock {
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
export const onDeleteStock = /* GraphQL */ `
  subscription OnDeleteStock {
    onDeleteStock {
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
export const onCreatePurchas = /* GraphQL */ `
  subscription OnCreatePurchas {
    onCreatePurchas {
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
export const onUpdatePurchas = /* GraphQL */ `
  subscription OnUpdatePurchas {
    onUpdatePurchas {
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
export const onDeletePurchas = /* GraphQL */ `
  subscription OnDeletePurchas {
    onDeletePurchas {
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
export const onCreateGroups = /* GraphQL */ `
  subscription OnCreateGroups {
    onCreateGroups {
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
export const onUpdateGroups = /* GraphQL */ `
  subscription OnUpdateGroups {
    onUpdateGroups {
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
export const onDeleteGroups = /* GraphQL */ `
  subscription OnDeleteGroups {
    onDeleteGroups {
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
export const onCreateGroupMem = /* GraphQL */ `
  subscription OnCreateGroupMem {
    onCreateGroupMem {
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
export const onUpdateGroupMem = /* GraphQL */ `
  subscription OnUpdateGroupMem {
    onUpdateGroupMem {
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
export const onDeleteGroupMem = /* GraphQL */ `
  subscription OnDeleteGroupMem {
    onDeleteGroupMem {
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
export const onCreateNotis = /* GraphQL */ `
  subscription OnCreateNotis {
    onCreateNotis {
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
export const onUpdateNotis = /* GraphQL */ `
  subscription OnUpdateNotis {
    onUpdateNotis {
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
export const onDeleteNotis = /* GraphQL */ `
  subscription OnDeleteNotis {
    onDeleteNotis {
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
export const onCreateCuss = /* GraphQL */ `
  subscription OnCreateCuss {
    onCreateCuss {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
export const onUpdateCuss = /* GraphQL */ `
  subscription OnUpdateCuss {
    onUpdateCuss {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
export const onDeleteCuss = /* GraphQL */ `
  subscription OnDeleteCuss {
    onDeleteCuss {
      id
      displayName
      depositor
      createdAt
      updatedAt
      groupsCussId
    }
  }
`;
