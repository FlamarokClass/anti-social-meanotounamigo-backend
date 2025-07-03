const { mongoose } = require('../bd/mongodb');

const userSchema = new mongoose.Schema({
    nickname:{
        type: String, 
        unique:true, 
        minlength:[3,'El nombre debe tener al menos 3 letras'], 
        required:[true, 'El nombre es obligatorio'],
        trim: true,
    },
    email:{
        type: String,  
        unique:true, 
        required:[true, 'El mail es obligatorio'],
        lowercase: true,
    },
    password: {
        type: String, 
        required:[true, 'El password es obligatorio'],
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
},
{
    collection:'usuarios'
}
);

//Modifica cómo se ve a la salida
userSchema.set("toJSON", {
    transform:(_,ret)=>{
        delete ret.__v
        ret.id = ret._id;
        delete ret._id;
    }
})

const Usuario = mongoose.model('User', userSchema);
module.exports = Usuario;