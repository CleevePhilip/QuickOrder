import React, { useState } from "react";
import Table from "../../components/Table";
import useFetchAndProcess from "../../hooks/useFetchAndProcess";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import TextInput from "../../components/TextInput";
import Select from "../../components/Select";
import { createData, editData, deleteData } from "../../services/apiService";

const Menu = () => {
  const [menuId, setMenuId] = useState(null);
  const [category, setCategory] = useState("");
  const [menu, setMenu] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    data: menuData,
    error: menuError,
    fetchData: fetchMenuData,
  } = useFetchAndProcess("menu");

  const { data: categoryData, error: categoryError } =
    useFetchAndProcess("category");
  const [message, setMessage] = useState(null);

  const resetForm = () => {
    setMenuId(null);
    setCategory("");
    setMenu("");
    setPrice("");
    setMessage(null);
  };

  const handleAddMenu = async () => {
    if (!category || !menu || !price) {
      return alert("Fill up all the data before saving!");
    }
    try {
      setLoading(true);
      const response = await createData("add-menu", {
        category_id: category,
        menu_name: menu,
        price: price,
      });
      if (response) {
        setMessage("Menu added successfully");
        resetForm();
        fetchMenuData();
      }
    } catch (error) {
      console.error("Failed to add menu:", error);
      setMessage("Failed to add menu");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMenu = async () => {
    if (!category || !menu || !price) {
      return alert("Fill up all the data before saving!");
    }
    try {
      setLoading(true);
      const response = await editData("edit-menu", {
        category_id: category,
        menu_name: menu,
        price: price,
        menu_id: menuId,
      });
      if (response) {
        setMessage("Menu edited successfully");
        resetForm();
        fetchMenuData();
      }
    } catch (error) {
      console.error("Failed to edit menu:", error);
      setMessage("Failed to edit menu");
    } finally {
      setLoading(false);
    }
  };

  const menuColumns = [
    { id: 1, Header: "Menu ID" },
    { id: 2, Header: "Category ID" },
    { id: 3, Header: "Menu Name" },
    { id: 4, Header: "Price" },
    { id: 5, Header: "Action" },
  ];

  const handleOpenEditModal = (item) => {
    setMenuId(item.menu_id);
    setCategory(item.category_id);
    setMenu(item.menu_name);
    setPrice(item.price);
  };

  const handleOpenAddMenuModal = () => {
    resetForm();
  };

  const handleDeleteMenu = async (menu_id) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        const response = await deleteData("delete-menu", {
          menu_id: menu_id,
        });
        if (response) {
          fetchMenuData();
          resetForm();
        } else {
          alert("Failed to delete menu");
        }
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };
  return (
    <div>
      <p className="text-sky-600 text-sm mb-3">Dashboard/Menu</p>
      {menuError && <p className="text-red-500">{menuError.message}</p>}
      {categoryError && <p className="text-red-500">{categoryError.message}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <div className="flex gap-3">
        {/* ADD MENU */}
        <Modal
          btnModalName="Add Menu"
          btnColor="btn-info"
          modalTitle="ADD MENU"
          modalDescription="Make sure the menu does not already exist"
          modalId="add_menu_modal"
          onOpen={handleOpenAddMenuModal}
          onClose={resetForm}
        >
          {message && <p className="text-red-500">{message}</p>}
          <Select
            value={category || ""}
            className="select select-info w-full"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoryData.map((item) => (
              <option key={item.category_id} value={item.category_id}>
                {item.category_name}
              </option>
            ))}
          </Select>
          <TextInput
            placeholder="ENTER MENU"
            type="text"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
          />
          <TextInput
            placeholder="ENTER PRICE"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button
            buttonName="ADD"
            btnColor="btn-info"
            onClick={handleAddMenu}
            disabled={loading}
          />
        </Modal>
        {/* ADD MENU */}
      </div>
      <Table>
        <thead>
          <tr>
            {menuColumns.map((item) => (
              <th key={item.id}>{item.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-auto ">
          {menuData.map((item) => (
            <tr key={item.menu_id}>
              <td>{item.menu_id}</td>
              <td>{item.category_id}</td>
              <td>{item.menu_name}</td>
              <td>{item.price}</td>
              <td>
                {/* EDIT MENU */}
                <Modal
                  btnModalName="Edit"
                  modalTitle="EDIT MENU"
                  modalDescription={`EDIT MENU ID ${item.menu_id}`}
                  btnColor="btn-warning"
                  modalId={`edit_menu_modal_${item.menu_id}`}
                  onOpen={() => handleOpenEditModal(item)}
                  onClose={resetForm}
                >
                  <p>Menu Id: {menuId}</p>
                  <Select
                    className="select select-info w-full"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categoryData.map((categoryItem) => (
                      <option
                        key={categoryItem.category_id}
                        value={categoryItem.category_id}
                      >
                        {categoryItem.category_name}
                      </option>
                    ))}
                  </Select>
                  <TextInput
                    placeholder="Menu Name"
                    value={menu}
                    onChange={(e) => setMenu(e.target.value)}
                    type="text"
                  />
                  <TextInput
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                  />
                  <Button
                    buttonName="Save"
                    btnColor="btn-warning"
                    onClick={handleEditMenu}
                    disabled={loading}
                  />
                </Modal>
                <Button
                  buttonName="Delete"
                  btnColor="btn-error"
                  btnSize="btn-xs"
                  onClick={() => handleDeleteMenu(item.menu_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Menu;
