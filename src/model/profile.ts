import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new ticket
interface ProfileAttrs {
  username: string;
  name: string;
  description: string;
  mbti: string;
  enneagram: string;
  variant: string;
  tritype: number;
  socionics: string;
  sloan: string;
  psyche: string;
  image: string;
}

// An interface that describes the properties
// that Ticket model has
interface ProfileModel extends mongoose.Model<ProfileDoc> {
  build(attrs: ProfileAttrs): ProfileDoc;
}

// An interface that describe the properties
// that Ticket document has
interface ProfileDoc extends mongoose.Document {
  username: string;
  name: string;
  description: string;
  mbti: string;
  enneagram: string;
  variant: string;
  tritype: number;
  socionics: string;
  sloan: string;
  psyche: string;
  image: string;
}

const ProfileSchema = new mongoose.Schema(
  {
    // username just for login
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mbti: {
      type: String,
      required: true,
    },
    enneagram: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    tritype: {
      type: Number,
      required: true,
    },
    socionics: {
      type: String,
      required: true,
    },
    sloan: {
      type: String,
      required: true,
    },
    psyche: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);

ProfileSchema.statics.build = (attrs: ProfileAttrs) => {
  return new Profile(attrs);
};

const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  "Profile",
  ProfileSchema
);

export { Profile, ProfileDoc, ProfileAttrs, ProfileModel };
