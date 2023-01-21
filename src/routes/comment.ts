import express, { Request, Response } from "express";
import { body, query } from "express-validator";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors";
import { Profile, Comment, CommentDoc } from "../model";
import { validateRequest, requireAuth } from "../middlewares";
import { MBTI_LIST, ENNEAGRAM_LIST, ZODIAC_LIST } from "../constants";

const router = express.Router();

router.post(
  "/:profileId/comments",
  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("mbti")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(MBTI_LIST)
      .withMessage("Invalid MBTI"),
    body("enneagram")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(ENNEAGRAM_LIST)
      .withMessage("Invalid Enneagram"),
    body("zodiac")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(ZODIAC_LIST)
      .withMessage("Invalid Zodiac"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, content, mbti, enneagram, zodiac } = req.body;
    const profile = await Profile.findById(
      new mongoose.Types.ObjectId(req.params.profileId)
    );
    const user = await Profile.findById(
      new mongoose.Types.ObjectId(req.user!.id)
    );

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    if (!user) {
      throw new BadRequestError("Invalid User");
    }

    if (profile.id == user.id) {
      throw new BadRequestError("Cannot comment on your own profile");
    }

    const comment = Comment.build({
      commentTo: profile.id,
      commentBy: user.id,
      title,
      content,
      mbti,
      enneagram,
      zodiac,
      votes: [],
    });
    await comment.save();

    res.status(201).send({
      message: "Comment successfully created",
      data: comment,
    });
  }
);

router.get(
  "/:profileId/comments",
  [
    query("filter")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(["mbti", "enneagram", "zodiac"])
      .withMessage("Invalid filter params"),
    query("sort")
      .trim()
      .optional({ checkFalsy: true })
      .isIn(["recent", "best"])
      .withMessage("Invalid sort params"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const profile = await Profile.findById(
      new mongoose.Types.ObjectId(req.params.profileId)
    );

    if (!profile) {
      throw new NotFoundError("Profile not found");
    }

    const query: mongoose.FilterQuery<CommentDoc> = {
      commentTo: { $eq: profile.id },
    };
    const sort: any = {}; // don't know the type :)

    if (req.query.filter) {
      const filter = req.query.filter as string;
      query[filter] = { $nin: [null, ""] };
    }

    switch (req.query.sort) {
      case "best":
        sort.votes = -1;
        break;
      case "recent":
      default:
        sort.createdAt = -1;
        break;
    }

    const comments = await Comment.find(query).sort(sort).populate("commentBy");

    res.status(200).send({
      message: "Fetch Comments successfully",
      data: comments,
    });
  }
);

router.get("/:profileId/comments/:id", async (req: Request, res: Response) => {
  const comment = await Comment.findById(
    new mongoose.Types.ObjectId(req.params.id)
  );

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  res.status(200).send({
    message: "Successfully get comment",
    data: comment,
  });
});

router.post(
  "/:profileId/comments/:id/like",
  requireAuth,
  async (req: Request, res: Response) => {
    const comment = await Comment.findById(
      new mongoose.Types.ObjectId(req.params.id)
    );

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const userId = req.user!.id as string;
    const userObjId = new mongoose.Types.ObjectId(userId);

    if (comment.votes.indexOf(userObjId) !== -1) {
      throw new BadRequestError("Already voted this comment");
    }

    comment.votes.push(userObjId);
    await comment.save();

    res.status(200).send({
      message: "Successfully like comment",
      data: comment.votes.length,
    });
  }
);

router.post(
  "/:profileId/comments/:id/dislike",
  requireAuth,
  async (req: Request, res: Response) => {
    const comment = await Comment.findById(
      new mongoose.Types.ObjectId(req.params.id)
    );

    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    const userId = req.user!.id as string;
    const userObjId = new mongoose.Types.ObjectId(userId);

    const voteIdx = comment.votes.indexOf(userObjId);
    if (voteIdx === -1) {
      throw new BadRequestError("You're not voted this comment");
    }

    comment.votes.splice(voteIdx, 1);
    // comment.votes.pull(userObjId);
    await comment.save();

    res.status(200).send({
      message: "Successfully dislike comment",
      data: comment.votes.length,
    });
  }
);

export default router;
