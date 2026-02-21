// Sharp is not needed for text-only embeddings.
// This shim prevents import errors.
// The library imports sharp as a default export.
const sharp = {};
export default sharp;
