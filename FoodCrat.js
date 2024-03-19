const cart = {}; //ประกาศตัวแปร cart เป็น Object ว่าง เพื่อเก็บข้อมูลสินค้าในตะกร้า
document.querySelectorAll(".order-button").forEach((button) => { 
  button.addEventListener("click", () => { 
    const productId = button.getAttribute("data-product-id");//ดึง productId จาก data-product-id
    const price = parseFloat(button.getAttribute("data-price")); //ดึง price จาก data-price 

    const productName =
      button.parentElement.querySelector(".card-title").textContent; //ดึง productName จากข้อความภายใน .card-title

    if (!cart[productId]) { //ตรวจสอบว่าสินค้าในตะกร้ามี productId นี้หรือไม่ ถ้าไม่มี ให้สร้างรายการใหม่ใน cart โดยใช้ productId เป็น key
      cart[productId] = { 
        quantity: 1, //ตั้งค่า quantity เป็น 1, price ตามราคาที่ดึงมา และ name ตามชื่อสินค้า
        price: price,
        name: productName,
      };
    } else {
      cart[productId].quantity++;
    }
    updateCartDisplay(); //เรียกใช้ฟังก์ชัน updateCartDisplay เพื่อแสดงข้อมูลตะกร้าล่าสุด
  });
});

function calculateTotalPriceAndQuantity() { //ใช้คำนวณยอดรวมสินค้าในตะกร้า
  let totalQuantity = 0; //เก็บจำนวนสินค้าทั้งหมด
  let totalPrice = 0; // เก็บยอดรวมราคา

  for (const productId in cart) { 
    const item = cart[productId]; 
    if (!isNaN(item.price)) { 
      totalQuantity += item.quantity; 
      totalPrice += item.quantity * item.price; //เพิ่มยอดรวมราคา quantity*price
    }
  }

  return { totalQuantity, totalPrice };  //คืนค่า totalQuantity และ totalPrice
}

function updateCartDisplay() {
  const orderItemsElement = document.querySelector(".order-items"); //เก็บ element ที่มี class ของ".order-items" คือส่วนที่แสดงรายการสินค้า
  const orderTotalElement = document.getElementById("order-total"); //เก็บ element ที่มี id "order-total" คือส่วนที่แสดงยอดรวมราคา

  orderItemsElement.innerHTML = ""; //ล้างข้อมูล (รายการสินค้า) ภายใน element ".order-items"

  let { totalQuantity, totalPrice } = calculateTotalPriceAndQuantity();

  for (const productId in cart) { //วนซ้ำไปตามรายการสินค้า (productId) ที่อยู่ใน object cart
    const item = cart[productId]; //เก็บข้อมูลสินค้าแต่ละชิ้นลงในตัวแปร item
    if (!isNaN(item.price)) { //ตรวจสอบว่า price ของสินค้าไม่ใช่ NaN (Not a Number)
      const orderItemElement = document.createElement("div"); //สร้าง element div ใหม่เพื่อเก็บข้อมูลแต่ละรายการสินค้า
      orderItemElement.classList.add("order-item"); //พิ่ม class "order-item" ให้กับ element div ที่สร้างใหม่
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
          

      // Add event listener to remove button
      const removeButton = orderItemElement.querySelector(".remove-button"); //ค้นหาปุ่ม "Remove" ภายในรายการสินค้าแต่ละชิ้น
      removeButton.addEventListener("click", () => {
        removeFromCart(productId); 
      });
    }
  }

  orderTotalElement.textContent = totalPrice.toFixed(2) + "บาท"; //แสดงค่า totalPrice(ยอดรวมราคา)ที่คำนวณได้ ลงใน element ที่มี id "order-total"
}

function removeFromCart(productId) { //ใช้สำหรับลบสินค้าออกจากตะกร้า
  if (cart[productId]) { //ตรวจสอบว่า productId  มีอยู่ใน object cart หรือไม่ ถ้ามี เข้าสู่ if statement ถ้าไม่มี จะไม่ลบสินค้า
    if (cart[productId].quantity > 1) { //ตรวจสอบจำนวนสินค้า มากกว่า 1 หรือไม่ถ้ามากกว่า 1
      cart[productId].quantity--; //ลดจำนวนสินค้าลง 1
    } else { //ถ้าจำนวนสินค้า 1 ชิ้น
      delete cart[productId];//ลบสินค้าออกจากตะกร้า
    }
    updateCartDisplay(); // แก้ไข: ให้เรียก updateCartDisplay เมื่อมีการลบสินค้า
  }
}

//จัดการการ "สั่งซื้อ" สินค้าในตะกร้า
document
  .getElementById("checkout-button")//ค้นหา element ที่มี id "checkout-button"
  .addEventListener("click", function () { //เพิ่ม event listener "click" เมื่อคลิกปุ่ม จะเรียกใช้ฟังก์ชั่นที่ระบุ
    updateCartDisplay();//เพื่ออัปเดตข้อมูลแสดงผลบนหน้าเว็บและแสดงรายการสินค้า ราคา และยอดรวมราคา
    var customerName = document.getElementById("customer-name").value; //ดึงข้อมูลชื่อลูกค้าจาก element ที่มี id "customer-name"
    var customerPhone = document.getElementById("customer-phone").value; //ดึงข้อมูลเบอร์โทรศัพท์ลูกค้าจาก element ที่มี id "customer-phone"
    var orderDate = document.getElementById("order-date").value; //ดึงข้อมูลวันที่สั่งซื้อจาก element ที่มี id "order-date"

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
      for (const productId in cart) { //วนซ้ำรายการสินค้าในตะกร้า
        const item = cart[productId];
        if (!isNaN(item.price)) { //ตรวจสอบว่า price ของสินค้าไม่ใช่ NaN (Not a Number)
          invoiceContent += `<li>${item.name} - จำนวน: ${item.quantity} x ${
            item.price.toFixed(2) + "บาท"
          }</li>`; //พิ่มข้อมูลสินค้า ชื่อสินค้า, จำนวน, ราคา ลงใน invoiceContent
        }
      }

      invoiceContent += `</ul><p><strong>รวมทั้งหมด :</strong> ${totalQuantity}</p>`;
      invoiceContent += `<p><strong>Total Price:</strong> ${
        totalPrice.toFixed(2) + "บาท"
      }</p>`; //แสดง  totalQuantity (จำนวนสินค้าทั้งหมด)  และ  totalPrice (ยอดรวมราคา)

      var printWindow = window.open("", "_blank"); //เปิดหน้าต่างใหม่สำหรับพิมพ์ใบเสร็จ
      printWindow.document.open(); //เตรียมหน้าต่างใหม่สำหรับเขียนเนื้อหา
      printWindow.document.write(invoiceContent); //เขียนเนื้อหาใบเสร็จลงในหน้าต่างใหม่
      printWindow.document.close(); //ปิดการเขียนเนื้อหา
      printWindow.print(); //สั่งพิมพ์ใบเสร็จ

      // ล้าง cart เมื่อกด checkout
      for (const productId in cart) { //ล้างข้อมูลสินค้าทั้งหมดในตะกร้า
        delete cart[productId];
      }
      updateCartDisplay(); //อัปเดตข้อมูลแสดงผลบนหน้าเว็บ


      // ล้างค่าชื่อ, เบอร์โทร, และวันที่
      document.getElementById("customer-name").value = "";
      document.getElementById("customer-phone").value = "";
      document.getElementById("order-date").value = "";
    } else {
      alert("Please fill in all customer details!"); //แสดงข้อความแจ้งเตือน กรณีกรอกข้อมูลไม่ครบถ้วน
    }
  });
