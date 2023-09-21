const router = require("express").Router();
const { watchOptions } = require("nodemon/lib/config/defaults");
const Post = require("../models/Post");
const User = require("../models/user");

// 投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// 投稿を更新する
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      return res.status(200).json("投稿を更新しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を編集できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 投稿を削除する
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).json("投稿を削除しました");
    } else {
      return res.status(403).json("あなたは他の人の投稿を削除できません");
    }
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 投稿を取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.status(200).json(post);
  } catch (err) {
    return res.status(403).json(err);
  }
});

// 特定の投稿にいいねを押す
router.put("/:id/like", async (req, res) => {
  try {
    const postId = await Post.findById(req.params.id); //いいねする投稿のオブジェクトID

    // まだいいねを押していなければ、いいねできる
    if (!postId.likes.includes(req.body.userId)) {
      await postId.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("いいねしました");

      // 投稿にすでにいいねを押していたら
    } else {
      // いいねしているユーザーIDを取り除く
      await postId.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      return res.status(200).json("投稿のいいねを解除しました");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// タイムラインの投稿を取得する
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });

    // 自分がフォローしている友達の投稿内容を全て取得する
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    return res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
