# Get the categories with most products and their handle and name
SELECT COUNT(product_category_id) as c, MAX(b.name), MAX(b.handle) from product_category_product as a INNER JOIN product_category as b ON a.product_category_id = b.id GROUP BY product_category_id ORDER BY c DESC;
