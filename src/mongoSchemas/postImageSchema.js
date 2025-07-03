const { mongoose } = require('../bd/mongodb');

const postImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'La URL es obligatoria']
  }
}, {
  collection: 'posteoImagen'
});

postImageSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret.__v;
    ret.id = ret._id;
    delete ret._id;
  }
});

const PostImage = mongoose.model('PostImage', postImageSchema);
module.exports = PostImage;