import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type: string;
  source: string;
  extraData?: Record<string, any>;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    type: { type: String, default: "Contact Form" },
    source: { type: String, default: "Website" },
    extraData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);

export default Submission;
