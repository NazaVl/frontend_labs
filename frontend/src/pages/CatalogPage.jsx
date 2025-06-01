import React, { useEffect, useState, useRef } from "react";
import { Link, useParams} from "react-router-dom";
import axios from 'axios';
import images from '../assets/img/catalog/CatalogPage.js';
import useIsAdmin from "../hooks/useAdmin";

export default function CatalogPage() {
  const isAdmin = useIsAdmin();
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [theme, setTheme] = useState("light");
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `http://localhost:5000/api/products?category=${category}`
          : "http://localhost:5000/api/products";

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Помилка завантаження товарів:", err);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 21 || currentHour < 6;
    const themeToSet = savedTheme || (isNight ? "dark" : "light");

    setTheme(themeToSet);
    document.body.classList.toggle("night-mode", themeToSet === "dark");
  }, []);

  /**Handle theme switch*/
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.classList.toggle("night-mode", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  /*(admin)*/

  const handleInputChange = (id, field, value) => {
    setEditedProducts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
        id,
      },
    }));
  };
  

  const handleAddProduct = (cat) => {
    const tempId = `temp-${Date.now()}`;
    setNewProducts((prev) => [
      ...prev,
      { id: tempId, name: "", description: "", price: "", category: cat },
    ]);
  };
  
  const handleDeleteProduct = (id) => {
    const token = localStorage.getItem("token");
  
    if (id.toString().startsWith("temp-")) {
      setNewProducts((prev) => prev.filter((p) => p.id !== id));
      return;
    }
  
    axios
      .delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch((err) => {
        console.error("Помилка при видаленні:", err);
      });
  };
  
  const handleSaveChanges = (category) => {
    const allDisplayedProducts = [...products, ...newProducts];
  
    const updatedProducts = allDisplayedProducts
      .filter(p => p.category === category)
      .map(p => {
        const edited = editedProducts[p.id];
        const rawPrice = edited?.price ?? p.price;
        const price = rawPrice === "" ? null : Number(rawPrice);

        return {
          id: p.id,
          name: edited?.name ?? p.name,
          description: edited?.description ?? p.description,
          price,
          category,
        };
      });

  
    const token = localStorage.getItem("token");
  
    axios
      .put("/api/products", { products: updatedProducts }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })
      .then(() => {
        console.log("Збережено:", updatedProducts);
        setEditedProducts({});
      })
      .catch((err) => {
        console.error("Помилка при збереженні:", err);
      });
  };
  
  const getCategoryProducts = (cat) => {
    const all = [...products, ...newProducts].filter(
      (product) => product.category === cat
    );

    return all.map((p) => ({
      ...p,
      ...editedProducts[p.id],
    }));
  };  


  /**render*/
  const renderCategoryBlock = (cat, title, imageSrc) => {
    if (category && category !== cat) return null;
  
    const filteredProducts = getCategoryProducts(cat);
  
    return (
      <div className={`${cat} instrument-category`}>
        <div className="catalog_themes_content">
          <h2>{title}</h2>
          <img id={`catalog_${cat}_img`} src={imageSrc} alt={title} />
        </div>
        <table>
          <thead>
            <tr><th>Назва</th><th>Опис</th><th>Ціна</th>{isAdmin &&(<th>Delete?</th>)}</tr>
          </thead>
          <tbody ref={tableRef}>
          {getCategoryProducts(cat).map((product, index) => (
              <tr key={`${product.id || 'new'}-${index}`}>
                <td>
                  {isAdmin ? (
                    <input
                      type="text"
                      value={product.name || ""}
                      onChange={(e) =>
                        handleInputChange(product.id, "name", e.target.value)
                      }
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {isAdmin ? (
                    <input
                      type="text"
                      value={product.description || ""}
                      onChange={(e) =>
                        handleInputChange(product.id, "description", e.target.value)
                      }
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td>
                  {isAdmin ? (
                    <input
                      type="number"
                      value={product.price || ""}
                      onChange={(e) =>
                        handleInputChange(product.id, "price", e.target.value)
                      }
                    />
                  ) : (
                    `${product.price} грн`
                  )}
                </td>
                {isAdmin && (
                  <td>
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  </td>
                )}
              </tr>

            ))}
          </tbody>
        </table>
        {isAdmin && (
          <button onClick={() => handleAddProduct(cat)}>Add</button>
        )}
        {isAdmin && filteredProducts.length > 0 && (
          <button onClick={() => handleSaveChanges(cat)}>Save</button>
        )}
      </div>
    );
  };
  
  return (
    <>
      <header>
        <h1>Каталог інструментів</h1>
        <nav>
          <div className="header_nav">
            <ul>
              <li><Link className="url_nav" to="/">Головна</Link></li>
              <li><Link className="url_nav" to="/catalog">Каталог</Link></li>
              <li><Link className="url_nav" to="/about">Про нас</Link></li>
              <li><Link className="url_nav" to="/contact">Контакти</Link></li>
            </ul>
            <div>
              <ul>
                <li><Link className="head_log_reg_url" to="/login">Log</Link></li>
                <li>|</li>
                <li><Link className="head_log_reg_url" to="/profile">User</Link></li>
              </ul>
            </div>
          </div>
        </nav>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "dark" ? "Світла тема" : "Темна тема"}
        </button>
      </header>

      <main>
        <section>
          <div className="filter">
            <Link to="/catalog" className={`filter_button ${!category ? 'active' : ''}`} data-category="all">Усі</Link>
            <Link to="/catalog/strings" className={`filter_button ${category === 'strings' ? 'active' : ''}`}>Струнні</Link>
            <Link to="/catalog/drums" className={`filter_button ${category === 'drums' ? 'active' : ''}`}>Ударні</Link>
            <Link to="/catalog/keys" className={`filter_button ${category === 'keys' ? 'active' : ''}`}>Клавішні</Link>
            <Link to="/catalog/winds" className={`filter_button ${category === 'winds' ? 'active' : ''}`}>Духові</Link>
          </div>
        </section>
        <section>
          <div className="catalog_content">
            {!category && (
              <>
                {renderCategoryBlock('strings', 'Струнні', images.strings)}
                {renderCategoryBlock('drums', 'Ударні', images.drums)}
                {renderCategoryBlock('keys', 'Клавішні', images.keys)}
                {renderCategoryBlock('winds', 'Духові', images.winds)}
              </>
            )}

            {category === 'strings' && renderCategoryBlock('strings', 'Струнні', images.strings)}
            {category === 'drums' && renderCategoryBlock('drums', 'Ударні', images.drums)}
            {category === 'keys' && renderCategoryBlock('keys', 'Клавішні', images.keys)}
            {category === 'winds' && renderCategoryBlock('winds', 'Духові', images.winds)}
            {category && !['strings', 'drums', 'keys', 'winds'].includes(category) && (
              <p>Неіснуюча категорія.</p>
            )}
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Музичний Світ</p>
      </footer>
    </>
  );
}