-- Style colors/sizes are sourced from itemAttributeSelection (see
-- 20260806145305_styles_from_attribute_selections). Assignment tables are no
-- longer read or written by application code.

DROP TABLE IF EXISTS "styleColorAssignment";
DROP TABLE IF EXISTS "styleSizeAssignment";

NOTIFY pgrst, 'reload schema';
