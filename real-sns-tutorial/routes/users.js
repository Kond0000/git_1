const router = require("express").Router();
const User = require("../models/user");

// CRUD
// ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("ユーザー情報が違います");
  }
});

// ユーザー情報の取得
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザー情報が削除されました");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("ユーザー情報が違います");
  }
});

// ユーザー情報の取得
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(other);
  }
});

// ユーザーのフォロー
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); //フォローするユーザー
      const currentUser = await User.findById(req.body.userId); //フォローされるユーザー

      // フォロワーに自分がいなければ、フォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローしました")
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーをフォロー済みです");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローすることはできません");
  }
});

// ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); //フォロー解除するユーザー
      const currentUser = await User.findById(req.body.userId); //フォロー解除されるユーザー

      // フォロワーに自分がいたら、フォローを外せる
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          },
        });
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          },
        });
        return res.status(200).json("フォローを解除しました")
      } else {
        return res
          .status(403)
          .json("あなたはすでにこのユーザーのフォロワー外です");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除することはできません");
  }
});

module.exports = router;
