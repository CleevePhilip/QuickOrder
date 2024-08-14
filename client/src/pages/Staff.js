import React, { useState, useEffect } from "react";
import axios from "axios";
import useFetchAndProcess from "../hooks/useFetchAndProcess";
import Table from "../components/Table";
import Select from "../components/Select";
import Modal from "../components/Modal";
import TextInput from "../components/TextInput";
import Button from "../components/Button";

const Staff = () => {
  // Fetch categories
  const {
    data: categoryData,
    error: categoryError,
    fetchData: fetchCategory,
  } = useFetchAndProcess("category");

  // Fetch all menu items
  const {
    data: menuData,
    error: menuError,
    fetchData: fetchMenu,
  } = useFetchAndProcess("menu");

  // State for category selection
  const [category, setCategory] = useState("");

  // Storage for menu data by category
  const [menuDataByCategory, setMenuDataByCategory] = useState({});

  // SORTING BASED ON CATEGORY: STEP 1
  // 1.  Fetch menu items by category
  const handleSortByCategory = async (category_id) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/getMenu-category",
        { category_id }
      );
      const result = response.data;
      if (result.success) {
        // 2. Store it in the object
        setMenuDataByCategory((prev) => ({
          ...prev,
          // 3. The result will be based on its category id
          // the key is categoryid result will be the data
          [category_id]: result.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // SORTING BASED ON CATEGORY: STEP 2
  useEffect(() => {
    if (category) {
      // If category is has values fetch the category
      handleSortByCategory(category);
    }
  }, [category]);

  // SORTING BASED ON CATEGORY: STEP 3
  //  After fetching filter the display data based on its category
  //if category has value display
  const filteredMenuData = category
    ? menuDataByCategory[category] || []
    : menuData;

  // State for order forms
  const [forms, setForms] = useState({
    menu_id: null,
    price: 0,
    quantity: 0,
    totalPrice: 0,
  });

  const handleAddOpenModal = (menu) => {
    setForms({
      menu_id: menu.menu_id,
      price: menu.price,
      quantity: 0,
      totalPrice: menu.price,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForms((prev) => ({ ...prev, [name]: value }));
  };

  // State for order details
  const [orderDetails, setOrderDetails] = useState([]);

  const handleOrder = (e) => {
    e.preventDefault();

    if (forms.quantity === 0) {
      alert("Make sure that quantity is not 0 before saving.");
      return;
    }

    const isMenuIdExist = orderDetails.some(
      (order) => order.menu_id === forms.menu_id
    );

    if (isMenuIdExist) {
      alert(
        "Can't add the same order. Make sure to modify it in the order details!"
      );
      return;
    }

    const totalPrice = calculateTotalPrice(forms.quantity, forms.price);

    const order = {
      menu_id: forms.menu_id,
      quantity: forms.quantity,
      price: forms.price,
      total_price: totalPrice,
    };

    setOrderDetails((prev) => [...prev, order]);

    setForms({
      menu_id: null,
      price: 0,
      quantity: 0,
      totalPrice: 0,
    });
  };

  const calculateTotalPrice = (quantity, price) => {
    return quantity * price;
  };

  const handleOrderFinish = async () => {
    if (orderDetails.length === 0) {
      alert("No order details to submit.");
      return;
    }

    try {
      const detailsWithOrderId = orderDetails.map((detail) => ({
        ...detail,
        order_id: orderId, // Include the order ID here
      }));

      const response = await axios.post(
        "http://localhost:8080/auth/order-details",
        detailsWithOrderId
      );

      if (response.data.success) {
        alert("Order successfully completed!");
        setOrderDetails([]);
        setRender("create");
        setSteps(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Steps for order creation and handling render state
  const [steps, setSteps] = useState(0);
  const [render, setRender] = useState("create");

  const handleStep = () => {
    const newStep = steps + 1;
    setSteps(newStep);
    if (newStep > 1) {
      setSteps(0);
      setRender("create");
    } else {
      setRender("finish");
    }
  };

  const [orderId, setOrderId] = useState(null);

  const handleStartOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/create-order",
        {
          customer_name: "",
          status: "pending",
        }
      );
      if (response.data.success) {
        setOrderId(response.data.order_id); // Save the created order ID for later use
        handleStep();
      } else {
        setRender("create");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {render === "create" ? (
        <div className="flex h-screen justify-center items-center bg-slate-100 overflow-hidden">
          <div className="flex justify-center items-center">
            <button onClick={handleStartOrder} className="btn btn-info">
              CREATE ORDER
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-screen bg-slate-100 overflow-hidden">
          <div className="bg-white h-full w-full flex-1 flex flex-col overflow-y-auto p-10">
            <p className="p-3 font-semibold">MENU</p>
            {menuError && <p className="text-red-500">{menuError}</p>}
            {categoryError && <p className="text-red-500">{categoryError}</p>}
            <Select
              value={category}
              className="select select-info w-[10rem]"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Category</option>
              {categoryData.map((category) => (
                <option value={category.category_id} key={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </Select>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Menu</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenuData.map((menu) => (
                  <tr key={menu.menu_id}>
                    <td>{menu.menu_id}</td>
                    <td>{menu.menu_name}</td>
                    <td>{menu.price}</td>
                    <td>
                      <Modal
                        modalTitle="ORDER"
                        btnModalName="Order"
                        btnColor="btn-success"
                        modalId="add_orderDetails"
                        onOpen={() => handleAddOpenModal(menu)}
                      >
                        <p>{forms.price}</p>
                        <TextInput
                          placeholder="Quantity"
                          type="number"
                          name="quantity"
                          value={forms.quantity}
                          onChange={handleChange}
                        />
                        <Button
                          btnSize=""
                          btnColor="btn-success"
                          buttonName="Save Order"
                          onClick={handleOrder}
                        />
                      </Modal>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="h-full w-full md:w-[40%] flex flex-col">
            <div className="overflow-y-auto w-full h-[70%]">
              <p className="p-3 font-semibold">ORDERS</p>
              <Table>
                <thead>
                  <tr>
                    <th>Menu</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((order, index) => (
                    <tr key={index}>
                      <td>{order.menu_id}</td>
                      <td>{order.quantity}</td>
                      <td>{order.price}</td>
                      <td>{order.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="p-4">
              <label className="block">Total:</label>
              <input
                className="border p-2"
                value={orderDetails.reduce(
                  (acc, order) => acc + order.total_price,
                  0
                )}
                readOnly
              />
              <button
                onClick={handleOrderFinish}
                className="ml-2 bg-blue-500 text-white p-2 rounded"
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Staff;
