const postModel = require("../models/posts");
const redis = require("redis");
redisClient = redis.createClient();

/** Creates a new post */
const createPost = async (req, res, next) => {
  try {
    const {
      body: { title, description },
    } = req;
    console.log({title, description});
    const post = await new postModel({ title, description });
    const savedPost = await post.save();
    res.send({
      code: 201,
      message: "Post added successfully!",
      data: savedPost,
    });
  } catch (error) {
    next(error);
  }
};

/** Fetches a post by postId */
const getPostById = async (req, res, next) => {
  try {
    const {
      params: { postId },
    } = req;
    const cachedKey = `post_${postId}`;
    const cacheResult = await redisClient.get(cachedKey);
    let postData = {};
    if (cacheResult) {
      postData = cacheResult;
    } else {
      postData = await postModel.findById(postId);
      postData = JSON.stringify(postData);
      await redisClient.set(cachedKey, postData, {
        EX: 60,
        NX: true,
      });
    }
    res.send({
      code: 200,
      message: "Post Retrieved Successfully.",
      data: postData,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/** Fetches all posts */
const getAllPosts = async (req, res, next) => {
  try {
    const {
      query: { page = 1, limit = 3 },
    } = req;
    const cachedKey = `posts_${page}_${limit}`;
    const cacheResult = await redisClient.get(cachedKey);
    let posts = [];
    if (cacheResult) {
      posts = cacheResult;
    } else {
      posts = await postModel
        .find()
        .sort({
          createdAt: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit);
      posts = JSON.stringify(posts);
      await redisClient.set(cachedKey, posts, {
        EX: 60,
        NX: true,
      });
    }
    res.send({
      code: 200,
      message: "Posts Retrieved Successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

/** Updates a post by postId */
const updatePostById = async (req, res, next) => {
  try {
    const {
      params: { postId },
      body: { title, description },
    } = req;
    const post = await postModel.findByIdAndUpdate(
      postId,
      {
        title,
        description,
      },
      { new: true }
    );
    res.send({
      status: 204,
      message: "Post updated successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

/**  Deletes a post by postId */
const deletePostById = async (req, res, next) => {
  try {
    const {
      params: { postId },
    } = req;
    const post = await postModel.findByIdAndRemove(postId);
    res.json({
      code: 200,
      message: "Post deleted successfully.",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostById,
  createPost,
  deletePostById,
  updatePostById,
  getAllPosts,
};
