import mongoose from "mongoose";
import { ProfileModel } from "./profile";

// An interface that describes the properties
// that are required to create a new ticket
interface CommentAttrs {
  commentTo: mongoose.Types.ObjectId;
  commentBy: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mbti: string;
  enneagram: string;
  zodiac: string;
  votes: mongoose.Types.ObjectId[];
}

// An interface that describes the properties
// that Ticket model has
interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

// An interface that describe the properties
// that Ticket document has
interface CommentDoc extends mongoose.Document {
  commentTo: mongoose.Types.ObjectId;
  commentBy: mongoose.Types.ObjectId;
  title: string;
  content: string;
  mbti: string;
  enneagram: string;
  zodiac: string;
  votes: mongoose.Types.ObjectId[];
}

const CommentSchema = new mongoose.Schema(
  {
    commentTo: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    commentBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mbti: {
      type: String,
      required: false,
    },
    enneagram: {
      type: String,
      required: false,
    },
    zodiac: {
      type: String,
      required: false,
    },
    votes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

CommentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  CommentSchema
);

export { Comment, CommentDoc, CommentAttrs, CommentModel };
