-- Ensure slider questions have an explicit color palette key.
UPDATE questions
SET config = JSON_SET(
  IFNULL(config, JSON_OBJECT()),
  '$.color_palette',
  'default'
)
WHERE type = 'slider'
  AND (
    config IS NULL
    OR JSON_EXTRACT(config, '$.color_palette') IS NULL
  );
