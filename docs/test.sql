SELECT
     c.count,
     c.name,
     product_category.handle as parent_handle
FROM
     ( SELECT
     COUNT(product_category_id) as count,
     MAX(parent_category_id) as parent_category_id,
     MAX(b.name) as name,
     MAX(b.handle) as handle
     from
     product_category_product as a
INNER JOIN product_category as b
  ON a.product_category_id = b.id
GROUP BY product_category_id
ORDER BY
count DESC) AS c
INNER JOIN product_category ON c.parent_category_id = product_category.id;
