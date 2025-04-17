from SPARQLWrapper import SPARQLWrapper, JSON

def generate_sparql_query(product_name=None, category_name=None, brand_name=None, price_min=None, price_max=None):
    query = """
PREFIX : <http://example.com/ontology#>
PREFIX ex: <http://example.com/data#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?product ?name ?price ?category ?brand WHERE {
    ?product a :Product ;
             :productName ?name ;
             :productPrice ?price ;
             :hasCategory ?cat ;
             :hasBrand ?br .

    ?cat :categoryName ?category .
    ?br :brandName ?brand .
"""

    # Điều kiện lọc
    filters = []

    if product_name:
        filters.append(f'FILTER(CONTAINS(LCASE(?name), LCASE("{product_name}")))')

    if category_name:
        filters.append(f'FILTER(LCASE(?category) = LCASE("{category_name}"))')

    if brand_name:
        filters.append(f'FILTER(LCASE(?brand) = LCASE("{brand_name}"))')

    if price_min is not None:
        filters.append(f'FILTER(?price >= {price_min})')

    if price_max is not None:
        filters.append(f'FILTER(?price <= {price_max})')

    # Gộp các filter vào query
    for f in filters:
        query += f"\n    {f}"

    query += "\n}"

    return query


# Khai báo SPARQL endpoint của bạn (thay đổi nếu cần)
sparql = SPARQLWrapper("http://localhost:3030/FirstDataset/sparql")  # Đổi URL theo server bạn dùng

# Viết SPARQL query: lấy tất cả sản phẩm
query = generate_sparql_query(
        product_name=None,
        category_name="Electronics",
        brand_name=None,
        price_min=None, 
        price_max=None
    )

# Thiết lập query
sparql.setQuery(query)
sparql.setReturnFormat(JSON)

# Gửi query và in kết quả
results = sparql.query().convert()

# Hiển thị dữ liệu
for result in results["results"]["bindings"]:
    print("Product:", result["product"]["value"])
    print("  Name:", result["name"]["value"])
    print("  Price:", result["price"]["value"])
    print("  Category:", result["category"]["value"])
    print("  Brand:", result["brand"]["value"])
    print("-" * 40)
