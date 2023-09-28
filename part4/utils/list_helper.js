const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, actualElement) => {
    return acc + actualElement.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  const result = blogs.reduce((acc, actualElement) => {
    return actualElement.likes > acc.likes ? actualElement : acc;
  }, blogs[0]);

  return result;
};

const mostBlogs = (blogs) => {
  const result = blogs.reduce(
    (acc, item) => {
      if (!acc[item.author]) {
        acc[item.author] = { author: item.author, blogs: 0 };
      }

        acc[item.author].blogs++;

      if (!acc.maiorObjeto || acc[item.author].blogs > acc.maiorObjeto.blogs) {
        acc.maiorObjeto = acc[item.author];
      }

      return acc;
    },
    { maiorObjeto: null }
  );

  return result.maiorObjeto
};


const mostLikes = (blogs) => {
  const result = blogs.reduce(
    (acc, item) => {
      if (!acc[item.author]) {
        acc[item.author] = { author: item.author, likes: 0 };
      }

        acc[item.author].likes += item.likes;

      if (!acc.maiorObjeto || acc[item.author].likes > acc.maiorObjeto.likes) {
        acc.maiorObjeto = acc[item.author];
      }

      return acc;
    },
    { maiorObjeto: null }
  );

  return result.maiorObjeto
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
