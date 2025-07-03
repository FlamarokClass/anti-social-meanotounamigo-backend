const { mongoose } = require('../bd/mongodb');
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    fecha:{
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/, // formato YYYY-MM-DD
    },

    descripcion: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return v.trim().length > 0;
            },
            message: 'La descripción no puede estar vacía',
        }
    },

    imagenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostImage',
    }],

    etiquetas: [{
        type: Schema.Types.ObjectId,
        ref: "Tag"
    }],

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
},

{
    collection:'posteos'
}
);

//Modifica cómo se ve a la salida
postSchema.set("toJSON", {
    virtual:true,
    transform:(_,ret)=>{
        delete ret.__v
        ret.id = ret._id;
        delete ret._id;
    }
})

const Posteo = mongoose.model('Post', postSchema );
module.exports = Posteo;