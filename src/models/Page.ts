import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  template: { 
    type: String, 
    required: true, 
    enum: [
      'home', 
      'about', 
      'team', 
      'careers', 
      'reviews', 
      'faq', 
      'contact', 
      'gallery', 
      'services', 
      'service-detail'
    ] 
  },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  metadata: {
    title: String,
    description: String,
  },
  // This could store page-specific overrides if needed later
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
