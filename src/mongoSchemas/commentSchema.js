const { mongoose } = require('../bd/mongodb');
const { Schema } = require('mongoose');

const commentSchema = new mongoose.Schema({
    contenido:{
        type: String,
        required: [true, 'El contenido es obligatorio'],
        trim: true,
        maxlength: 2000
    },

    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },

    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
{
    collection: "comentarios",
    toJSON: { virtuals: true }
}
);

    commentSchema.virtual("antiguedad").get(function () {
        const ahora = new Date();
        return (ahora.getFullYear() - this.fecha.getFullYear()) * 12 + (ahora.getMonth() - this.fecha.getMonth());
});

    commentSchema.set("toJSON", {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
    }
});

const Comentario = mongoose.model('Comment', commentSchema);
module.exports = Comentario;