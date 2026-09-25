CREATE TRIGGER IF NOT EXISTS trg_inventory_reserved_not_over_on_hand
BEFORE UPDATE OF reserved, on_hand ON inventory
WHEN NEW.reserved < 0 OR NEW.on_hand < 0 OR NEW.reserved > NEW.on_hand
BEGIN
  SELECT RAISE(ABORT, 'inventory reservation exceeds available stock');
END;

CREATE TRIGGER IF NOT EXISTS trg_inventory_insert_valid
BEFORE INSERT ON inventory
WHEN NEW.reserved < 0 OR NEW.on_hand < 0 OR NEW.reserved > NEW.on_hand
BEGIN
  SELECT RAISE(ABORT, 'invalid inventory state');
END;

PRAGMA optimize;
