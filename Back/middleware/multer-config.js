const mutler = require('multer')

const MIME_TYPES = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png',
}

const storage = mutler.diskStorage({
    destination: (req,file,callback) => {
        callback(null,'images')
    },
    filename : (req,file,callback) =>{
        const name = file.originalname.split(' ').join('_')
        const extension = MIME_TYPES[file.mimetype]
        callback(null,name + Date.now() + '.' + extension)
    }
})

module.exports = mutler({storage}).single('image')