// Question 7
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  /*
    Issue: The cart have not initialize from localStorage
    const [cart, setCart] = useState([]);
  */
  const [cart, setCart] = useState(() => {
    // Initialize cart from localStorage if present
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (err) {
      console.error('Error reading cart from localStorage:', err);
      return [];
    }
  });

  // Improvement: Add the error state to store the error message
  const [error, setError] = useState(null);

  // Issue: There is not handle when the filter is empty.
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
    // prevent the api fetch if the filter is empty
      const apiUrl = !filter
        ? 'https://api.example.com/products'
        : `https://api.example.com/products?filter=${encodeURIComponent(filter)}`;
      const res = await axios.get(apiUrl);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadProducts();
  }, [filter, loadProducts]);
  
  /*
    Issue: Using the localStorage and state to handle the value of cart. It also can use the one way only that handle it.
    const addToCart = (product) => {
        cart.push(product);
        setCart(cart);
        localStorage.setItem('cart', JSON.stringify(cart));
    };
  */
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cart]);

  // Improvement: check the id is the same to confirm the value consistent
  const addToCart = (product) => {
    setCart(prevCart => {
      if (prevCart.find(item => item.id === product.id)) return prevCart;
      return [...prevCart, product];
    });
  };

  // Improvement: add check type to prevent the type mismatch
  const filteredProducts = products.filter(p =>
    p.name && typeof p.name === 'string'
      ? p.name.toLowerCase().includes(filter.toLowerCase())
      : false
  );

    return (
    /**
     * Issue: input element syntax error and miss the input type
     * <div><inputvalue={filter}onChange={(e) => setFilter(e.target.value)} 
        placeholder="Search products"
      />
      
      {loading && <div>Loading...</div>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredProducts.map((product, index) => (
          <div key={index} style={{border: '1px solid #ccc', 
            padding: '20px', 
            margin: '10px',
            width: '200px'
          }}><img src={product.image} width="100%" /><h3>{product.name}</h3><p>${product.price}</p><button onClick={() => addToCart(product)}>
              Add to Cart
            </button></div>
        ))}
      </div><div style={{ position: 'fixed', top: 0, right: 0 }}>
        Cart: {cart.length} items
      </div></div>
  );
     *  */
    // Improvement: make the code be clear and readable
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search products"
        // Improvement: add the aria-label
        aria-label="Search products"
      />
        {loading && <div>Loading...</div>}
        {/* Improvement: add the error message  */}
      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {filteredProducts.map((product) => (
            <div
            // Improvement: use the product id to be the key
            key={product.id}
            style={{
              border: '1px solid #ccc',
              padding: '20px',
              margin: '10px',
              width: '200px'
            }}>
            <img src={product.image} alt={product.name} width="100%" />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

/* The improvements made to the ProductList component significantly enhance its readability, maintainability, 
    and user experience. Previously, the product key in the list rendering used the array index, 
    which can cause issues when products are reordered or removed; 
    now it uses the product’s unique id, ensuring stable key assignment. 
    Error states are now handled and clearly displayed to users, providing better feedback when something goes wrong while fetching the product data. 
    The loading state is also surfaced via a “Loading…” indicator, making asynchronous data-fetching interactions friendlier. 
    The inclusion of a search input with an associated aria-label improves accessibility for screen readers. 
    Structurally, the UI is organized using flex layout for the product grid, and inline styles are made more consistent and readable. Alt text for images was specified to improve accessibility. 
    These collective enhancements result in a more robust, maintainable, and user-friendly component.
*/
