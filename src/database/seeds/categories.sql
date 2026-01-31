-- Garment categories seed data for FabricFlow inventory system
INSERT INTO categories (name, description) VALUES 
    ('Men''s Wear', 'Men''s clothing and apparel'),
    ('Women''s Wear', 'Women''s clothing and apparel'),
    ('Kids'' Wear', 'Children''s clothing and apparel'),
    ('Accessories', 'Fashion accessories like belts, bags, jewelry'),
    ('Fabrics', 'Raw materials and textiles for garment production'),
    ('Footwear', 'Shoes, sandals, boots and other footwear'),
    ('Undergarments', 'Innerwear, lingerie, and undergarments'),
    ('Activewear', 'Sportswear and athletic clothing'),
    ('Formal Wear', 'Suits, dresses, and formal occasion clothing'),
    ('Casual Wear', 'Everyday casual clothing and loungewear'),
    ('Outerwear', 'Jackets, coats, and outer garments'),
    ('Traditional Wear', 'Ethnic and traditional clothing'),
    ('Denim', 'Jeans and denim-based clothing'),
    ('Knitwear', 'Sweaters, cardigans, and knitted garments'),
    ('Sleepwear', 'Pajamas, nightwear, and loungewear')
ON CONFLICT (name) DO NOTHING;