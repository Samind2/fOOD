const cart = {}; 
document.querySelectorAll(".order-button").forEach((button) => { 
  button.addEventListener("click", () => { 
    const productId = button.getAttribute("data-product-id");
    const price = parseFloat(button.getAttribute("data-price")); 

    const productName =
      button.parentElement.querySelector(".card-title").textContent;

    if (!cart[productId]) { 
      cart[productId] = { 
        quantity: 1, 
        price: price,
        name: productName,
      };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay(); 
  });
});

function calculateTotalPriceAndQuantity() { 
  let totalQuantity = 0; 
  let totalPrice = 0;

  for (const productId in cart) { 
    const item = cart[productId];
    if (!isNaN(item.price)) { 
      totalQuantity += item.quantity;
      totalPrice += item.quantity * item.price; 
    }
  }

  return { totalQuantity, totalPrice };  
}

function updateCartDisplay() {
  const orderItemsElement = document.querySelector(".order-items"); 
  const orderTotalElement = document.getElementById("order-total"); 

  orderItemsElement.innerHTML = ""; 

  let { totalQuantity, totalPrice } = calculateTotalPriceAndQuantity();

  for (const productId in cart) { 
    const item = cart[productId]; 
    if (!isNaN(item.price)) { 
      const orderItemElement = document.createElement("div"); 
      orderItemElement.classList.add("order-item"); 
      orderItemElement.innerHTML = `
                <p><span class="item-name">${
                  item.name //แสดงชื่อสินค้า
                }</span> - จำนวน: <span class="item-quantity">${
        item.quantity // แสดงจำนวนสินค้า
      }</span> x <span class="item-price">${
        item.price.toFixed(2) + "บาท" //แสดงราคาสินค้าแบบทศนิยม
      }</span> 
                <button class="remove-button" data-product-id="${productId}">Remove</button></p> 
            `;
            orderItemsElement.appendChild(orderItemElement);
            
      const removeButton = orderItemElement.querySelector(".remove-button");
      removeButton.addEventListener("click", () => {
        removeFromCart(productId); 
      });
    }
  }

  orderTotalElement.textContent = totalPrice.toFixed(2) + "บาท"; 
}

function removeFromCart(productId) { 
  if (cart[productId]) { 
    if (cart[productId].quantity > 1) { 
      cart[productId].quantity--; 
    } else { 
      delete cart[productId];
    }
    updateCartDisplay(); 
  }
}

//จัดการการ "สั่งซื้อ" สินค้าในตะกร้า
document
  .getElementById("checkout-button")
  .addEventListener("click", function () { จะเรียกใช้ฟังก์ชั่นที่ระบุ
    updateCartDisplay();
    var customerName = document.getElementById("customer-name").value; 
    var customerPhone = document.getElementById("customer-phone").value; 
    var orderDate = document.getElementById("order-date").value; 

    if (customerName && customerPhone && orderDate) { 
      var { totalQuantity, totalPrice } = calculateTotalPriceAndQuantity();

      var invoiceContent = `
            <h2>FOOD BILL</h2>
            <p><strong>Restaurant Name:</strong> WAHNJEAB </p>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Customer Phone:</strong> ${customerPhone}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <h3>Order Items:</h3>
            <ul>
        `; 
      // แสดงรายการสินค้าและจำนวนที่ถูกสร้างขึ้นใน updateCartDisplay
      for (const productId in cart) { 
        const item = cart[productId];
        if (!isNaN(item.price)) { 
          invoiceContent += `<li>${item.name} - จำนวน: ${item.quantity} x ${
            item.price.toFixed(2) + "บาท"
          }</li>`; 
        }
      }

      invoiceContent += `</ul><p><strong>รวมทั้งหมด :</strong> ${totalQuantity}</p>`;
      invoiceContent += `<p><strong>Total Price:</strong> ${
        totalPrice.toFixed(2) + "บาท"
      }</p>`; 

      var printWindow = window.open("", "_blank"); 
      printWindow.document.open(); 
      printWindow.document.write(invoiceContent); 
      printWindow.document.close(); 
      printWindow.print(); 

      
      for (const productId in cart) { 
        delete cart[productId];
      }
      updateCartDisplay(); 


      // ล้างค่าชื่อ, เบอร์โทร, และวันที่
      document.getElementById("customer-name").value = "";
      document.getElementById("customer-phone").value = "";
      document.getElementById("order-date").value = "";
    } else {
      alert("Please fill in all customer details!"); //แสดงข้อความแจ้งเตือน กรณีกรอกข้อมูลไม่ครบถ้วน
    }
  });
