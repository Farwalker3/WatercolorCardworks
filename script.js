      // Add your existing scripts here
      
      // JavaScript code for customization options
      document.addEventListener('DOMContentLoaded', function () {
        // Event listener for color pickers
        const colorPickers = document.querySelectorAll('.color-picker input');
        colorPickers.forEach(picker => {
          picker.addEventListener('input', updateColor);
        });
        
        // Event listener for image upload
        const imgInput = document.getElementById('img');
        imgInput.addEventListener('change', updateBackgroundImage);
        
        // Event listener for copy values button
        const copyValuesBtn = document.getElementById('copyValuesBtn');
        copyValuesBtn.addEventListener('click', copyAllValuesToClipboard);
      });
      
      // Function to update colors dynamically
      function updateColor() {
        const valueSpan = document.getElementById(`${this.id}-value`);
        valueSpan.textContent = this.value;
        document.documentElement.style.setProperty(`--${this.id}`, this.value);
      }
      
      // Function to update background image dynamically
      function updateBackgroundImage() {
        const fileInput = document.getElementById('img');
        const file = fileInput.files[0];
        
        if (file) {
          const reader = new FileReader();
          
          reader.onload = function (e) {
            const imageUrl = `url('${e.target.result}')`;
            
            // Remove existing background image rules
            const styleSheet = document.styleSheets[0];
            const rules = styleSheet.rules || styleSheet.cssRules;
            for (let i = 0; i < rules.length; i++) {
              if (rules[i].selectorText === 'body::before') {
                // Assuming the old background image is the first url() in the background property
                rules[i].style.backgroundImage = `${imageUrl}, ${imageUrl}, ${imageUrl}`;
                return;
              }
            }
            
            // If no existing rule is found, insert a new one
            styleSheet.insertRule(`body::before { background: linear-gradient(to bottom, rgba(240, 240, 240, 0.75), rgba(240, 240, 240, 0.75)), ${imageUrl}, ${imageUrl}, ${imageUrl}; }`, 0);
          };
          
          reader.readAsDataURL(file);
        }
      }
      
      // Function to copy a value to clipboard
      function copyToClipboard(id) {
        const value = document.getElementById(`${id}-value`).textContent;
        navigator.clipboard.writeText(value).then(function () {
          alert(`${id} value copied to clipboard: ${value}`);
        }).catch(function (err) {
          console.error('Unable to copy to clipboard', err);
        });
      }
      
      // Function to copy all values to clipboard
      function copyAllValuesToClipboard() {
        const backgroundColor = document.getElementById('text-color-value').textContent;
        const accentColor = document.getElementById('accent-value').textContent;
        const footerColor = document.getElementById('footer-background-value').textContent;
        
        // Get the uploaded image file
        const imgInput = document.getElementById('img');
        const imageFile = imgInput.files[0];
        
        // Construct the email body
        const valuesToCopy = `
      Main Color: ${backgroundColor}
      Accent Color: ${accentColor}
      Footer Color: ${footerColor}
      `;
        
        navigator.clipboard.writeText(valuesToCopy).then(function () {
          alert('Values copied to clipboard');
        }).catch(function (err) {
          console.error('Unable to copy values to clipboard', err);
        });
      }
      
/* Add To Cart
      
      document.addEventListener('DOMContentLoaded', function () {
        // Event listener for add to cart buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
          button.addEventListener('click', function(event) {
            addToCart(event);
            toggleCart();
            updateTotal(); // Update total price
          });
        });
      });
      
      function toggleCart() {
        const sideCart = document.getElementById('sideCart');
        sideCart.classList.toggle('visible');
        
        const sideMenuToggle = document.getElementById('sideCartToggle');
        sideMenuToggle.checked = !sideMenuToggle.checked; // Toggle the checked state
      }

      
      function addToCart(event) {
        const groupElement = event.target.closest('.card-grid');
        const groupName = groupElement.querySelector('.GroupHeader').textContent.trim();
        const price = getPriceForGroup(groupName);
        const cartItemsContainer = document.getElementById('sideCartItems');
        let cartIsEmpty = cartItemsContainer.querySelector('p');
        
        if (cartIsEmpty) {
          cartItemsContainer.innerHTML = ''; // Remove "Your cart is empty" message
        }
        
        const existingCartItem = cartItemsContainer.querySelector(`.cart-item[data-group="${groupName}"]`);
        
        if (existingCartItem) {
          const quantityElement = existingCartItem.querySelector('.item-quantity-value');
          const quantity = parseInt(quantityElement.textContent) + 1;
          quantityElement.textContent = quantity;
          existingCartItem.querySelector('.item-total-price').textContent = `$${(quantity * price).toFixed(2)}`;
        } else {
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');
          cartItem.setAttribute('data-group', groupName);
          
          cartItem.innerHTML = `
  <div>
    <span class="item-label">Item Name:</span>
    <span class="item-name">${groupName}</span>
  </div>
  <div>
    <span class="item-label">Item Price:</span>
    <span class="item-price">$${price.toFixed(2)}</span>
  </div>
  <div>
    <span class="item-label">Quantity:</span>
    <span class="quantity-container">
      <button class="quantity-button" onclick="changeQuantity(this, -1)">-</button>
      <span class="item-quantity-value">1</span>
      <button class="quantity-button" onclick="changeQuantity(this, 1)">+</button>
    </span>
  </div>
  <div>
    <span class="item-label">Total Price:</span>
    <span class="item-total-price">$${price.toFixed(2)}</span>
  </div>
  <button class="remove-from-cart" onclick="removeFromCart(this)">Remove</button>
`;
          
          cartItemsContainer.appendChild(cartItem);

        }
        updateTotal(); // Update total price
      }
      
      function updateTotal() {
        const cartItems = document.querySelectorAll('.cart-item');
        let totalPrice = 0;
        cartItems.forEach(item => {
          const totalItemPrice = parseFloat(item.querySelector('.item-total-price').textContent.replace('$', ''));
          totalPrice += totalItemPrice;
        });
        const checkoutButton = document.getElementById('checkoutBtn');
        checkoutButton.textContent = `Checkout - total: $${totalPrice.toFixed(2)}`;
      }

      
      function changeQuantity(button, change) {
        const cartItem = button.closest('.cart-item');
        const quantityElement = cartItem.querySelector('.item-quantity-value');
        const priceElement = cartItem.querySelector('.item-price');
        const totalPriceElement = cartItem.querySelector('.item-total-price');
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        let quantity = parseInt(quantityElement.textContent) + change;
        
        if (quantity < 1) quantity = 1; // Minimum quantity is 1
        quantityElement.textContent = quantity;
        totalPriceElement.textContent = `$${(quantity * price).toFixed(2)}`;
        
        updateTotal(); // Update total price
      }
      
      function removeFromCart(button) {
        const cartItem = button.closest('.cart-item');
        cartItem.remove();
        
        const cartItemsContainer = document.getElementById('sideCartItems');
        if (!cartItemsContainer.querySelector('.cart-item')) {
          cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        }
        
        updateTotal(); // Update total price
      }
      
      function getPriceForGroup(group) {
        // Define prices for different groups
        const prices = {
          'Assorted': 10.00,  // Default price for Assorted greeting cards
          'Farmers Friends': 15.00,
          'Wild Strawberries': 12.00,
          'Feathered Friends': 14.00,
          'Holiday Cards': 20.00
        };
        return prices[group] || 0;  // Default price is 0 if group not found
      }

*/