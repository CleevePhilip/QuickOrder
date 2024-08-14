import React, { useState } from "react";
import useFetchAndProcess from "../../hooks/useFetchAndProcess";
import { createData, editData, deleteData } from "../../services/apiService";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

const Category = () => {
  const [categoryID, setCategoryID] = useState(null);
  const [category, setCategory] = useState("");
  const {
    data: categoryData,
    error: categoryError,
    fetchData: fetchCategoryData,
  } = useFetchAndProcess("category");

  const resetForm = () => {
    setCategory("");
    setCategoryID(null);
  };

  const onOpenEditCategory = (item) => {
    setCategoryID(item.category_id);
    setCategory(item.category_name);
  };

  const handleEditCategory = async () => {
    if (!category) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      const response = await editData("update-category", {
        category_id: categoryID,
        category_name: category,
      });
      if (response) {
        fetchCategoryData();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to edit category:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!category) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      const response = await createData("add-category", {
        category_name: category,
      });
      if (response) {
        fetchCategoryData();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleDeleteCategory = async (category_id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await deleteData("delete-category", {
          category_id: category_id,
        });
        if (response) {
          fetchCategoryData();
          resetForm();
        } else {
          alert("Failed to delete category");
        }
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const columns = [
    { id: 1, Header: "Category ID" },
    { id: 2, Header: "Category" },
    { id: 3, Header: "Actions" },
  ];

  return (
    <>
      <p>Dashboard/Category</p>
      {categoryError && <p className="text-red-500">{categoryError.message}</p>}
      <Modal
        btnModalName="Add Category"
        btnColor="btn-info"
        modalDescription="PRESS ESC TO ESCAPE"
        modalTitle="Add Category"
        modalId="add_category"
        onOpen={resetForm}
      >
        <TextInput
          placeholder="Enter category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button
          buttonName="ADD"
          btnColor="btn-info"
          btnSize="btn-xl"
          onClick={handleAddCategory}
        />
      </Modal>
      <Table>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {columns.map((items) => (
                  <th key={items.id}>{items.Header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item) => (
                <tr key={item.category_id}>
                  <td>{item.category_id}</td>
                  <td>{item.category_name}</td>
                  <td>
                    <Modal
                      btnModalName="Edit"
                      btnColor="btn-warning"
                      modalDescription="PRESS ESC TO ESCAPE"
                      modalTitle="Edit Category"
                      modalId={`edit_category_${item.category_id}`}
                      onOpen={() => onOpenEditCategory(item)}
                      onClose={resetForm}
                    >
                      <p>Category ID: {categoryID}</p>
                      <TextInput
                        placeholder="Enter category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                      <Button
                        buttonName="Save"
                        btnColor="btn-warning"
                        btnSize="btn-xl"
                        onClick={handleEditCategory}
                      />
                    </Modal>
                    <Button
                      buttonName="Delete"
                      btnColor="btn-error"
                      btnSize="btn-xs"
                      onClick={() => handleDeleteCategory(item.category_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Table>
    </>
  );
};

export default Category;
