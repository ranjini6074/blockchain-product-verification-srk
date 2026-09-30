const apiBase = 'http://localhost:5000/api';

async function loadProducts() {
  try {
    const response = await fetch(`${apiBase}/products`);
    const products = await response.json();

    const list = document.getElementById('productsList');
    list.innerHTML = products.map(product => `
      <div class="product-item">
        <strong>${product.product_name}</strong><br>
        Code: ${product.product_code}<br>
        Batch: ${product.batch_number}<br>
        Expiry: ${product.expiry_date}<br>
        Status: ${product.status}
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    product_code: document.getElementById('product_code').value,
    product_name: document.getElementById('product_name').value,
    batch_number: document.getElementById('batch_number').value,
    category: document.getElementById('category').value,
    manufacturer: document.getElementById('manufacturer').value,
    supplier_id: Number(document.getElementById('supplier_id').value || 0),
    manufacturing_date: document.getElementById('manufacturing_date').value,
    expiry_date: document.getElementById('expiry_date').value,
    quantity: Number(document.getElementById('quantity').value || 0)
  };

  const response = await fetch(`${apiBase}/products/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  alert(result.message || 'Product registration complete');
  loadProducts();
});

document.getElementById('verifyBtn').addEventListener('click', async () => {
  const code = document.getElementById('verifyCode').value.trim();

  if (!code) {
    alert('Please enter a product code');
    return;
  }

  try {
    const response = await fetch(`${apiBase}/verify/${code}`);
    const data = await response.json();

    document.getElementById('verificationResult').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error(error);
    document.getElementById('verificationResult').textContent = 'Verification failed';
  }
});

loadProducts();
