-- Migration 011: Pin questionnaire snapshot + asked question snapshot
--
-- Why:
-- - Stations can change questionnaire over time.
-- - Questionnaires can contain pool-slots, so we must persist which concrete questions were asked.
-- - For science/CSV transparency we must distinguish:
--   - not asked (pool not selected)
--   - asked but unanswered
--   - answered

-- 1) Persist questionnaire_key snapshot on pins
ALTER TABLE pins
  ADD COLUMN questionnaire_key VARCHAR(64) NOT NULL DEFAULT 'default';

-- Backfill existing rows (if any) with station's questionnaire, else default.
UPDATE pins p
LEFT JOIN stations s ON s.station_key = p.station_key
LEFT JOIN questionnaires q ON q.id = s.questionnaire_id
SET p.questionnaire_key = COALESCE(q.questionnaire_key, 'default')
WHERE p.questionnaire_key IS NULL OR p.questionnaire_key = '';

-- 2) Persist asked question selection per pin (resolved slots, incl. pools)
CREATE TABLE IF NOT EXISTS pin_questionnaire_questions (
  pin_id INT NOT NULL,
  questionnaire_key VARCHAR(64) NOT NULL,
  slot_id INT DEFAULT NULL,
  slot_sort INT NOT NULL DEFAULT 0,
  slot_mode ENUM('fixed', 'pool') NOT NULL DEFAULT 'fixed',
  question_key VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (pin_id, question_key),
  INDEX idx_pqq_pin (pin_id),
  INDEX idx_pqq_questionnaire (questionnaire_key),
  FOREIGN KEY (pin_id) REFERENCES pins(id) ON DELETE CASCADE,
  FOREIGN KEY (question_key) REFERENCES questions(question_key) ON DELETE CASCADE
);

-- Note: Backfilling pin_questionnaire_questions for legacy pins is not reliable
-- (pool selection was not persisted historically). We keep it empty for old pins.

