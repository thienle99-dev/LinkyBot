-- Function to calculate total clicks efficiently
CREATE OR REPLACE FUNCTION get_total_clicks()
RETURNS bigint
LANGUAGE sql
AS $$
  SELECT COALESCE(SUM(clicks), 0) FROM links;
$$;
