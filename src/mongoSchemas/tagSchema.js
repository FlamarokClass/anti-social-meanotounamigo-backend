const { mongoose } = require('../bd/mongodb');

const tagSchema = new mongoose.Schema({
    nombre: {
        type: String,
        unique: true,
        trim: true,
        required:[true, 'El nombre es obligatorio'],
    }
},
{
    collection:'etiquetas'
}
);

//Modifica cómo se ve a la salida
tagSchema.set("toJSON", {
    transform:(_,ret)=>{
        delete ret.__v
        ret.id = ret._id;
        delete ret._id;
    }
})

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
