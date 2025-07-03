const { deleteAssociatedPostData } = require('./postCascadeHelpers');
const { deleteUserRelatedData } = require('./userCascadeHelper');
const { seisMesesAtras } = require('./dateHelpers');

module.exports = {
  deleteAssociatedPostData,
  deleteUserRelatedData,
  seisMesesAtras
};