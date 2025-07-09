const fs = require('fs');
const path = require('path');

async function deleteFileByUrl(fileUrl) {
  const filename = path.basename(fileUrl);
  const filePath = path.resolve(process.cwd(), 'uploads', filename);

  try {
    await fs.promises.unlink(filePath);
    console.log(`Archivo eliminado: ${filename}`);
  } catch (err) {
    console.warn(`No se pudo borrar ${filename}: ${err.message}`);
  }
}

module.exports = { deleteFileByUrl };