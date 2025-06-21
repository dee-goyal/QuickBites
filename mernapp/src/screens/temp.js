import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Card";

export default function Home() {
  const [search, setSearch] = useState("");
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  // Load data from API
  const loadData = async () => {
    try {
      // Correct API endpoint and GET request
      let response = await fetch("http://localhost:5000/api/foodData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      console.log("API Response:", JSON.stringify(data, null, 2)); 
 // Debugging: Log the API response

      // Ensure the response is an array with two elements
      if (Array.isArray(data) && data.length === 2) {
        setFoodItem(data[0]); // Food items
        setFoodCat(data[1]); // Food categories
      } else {
        console.error("Invalid API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <div>
        {/* Carousel Section */}
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
          style={{ objectFit: "contain !important" }}
        >
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: "10" }}>
              <div className="d-flex justify-content-center">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-success text-white bg-success"
                  type="submit"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="carousel-item active">
              <img
                src="https://loremflickr.com/900/700/coffee"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://loremflickr.com/900/700/cake"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://loremflickr.com/900/700/pasta"
                className="d-block w-100"
                style={{ filter: "brightness(30%)" }}
                alt="..."
              />
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        {/* Food Categories and Items Section */}
        <div className="container mt-4">
          {foodCat.length > 0 ? (
            foodCat.map((category) => (
              <div key={category._id} className="mb-4">
                <div className="fs-3 m-3">{category.CategoryName}</div>
                <hr />
                <div className="row">
                  {foodItem.length > 0 ? (
                    foodItem
                      .filter(
                        (item) =>
                          item.CategoryName === category.CategoryName &&
                          (search === "" ||
                            item.name.toLowerCase().includes(search.toLowerCase()))
                      )
                      .map((filteredItem) => (
                        <div
                          key={filteredItem._id}
                          className="col-12 col-md-6 col-lg-3 mb-4"
                        >
                          <Card
                            foodItem={filteredItem}
                            // foodName={filteredItem.name}
                            options={filteredItem.options[0]}
                            // ImgSrc={filteredItem.img}
                          />
                        </div>
                      ))
                  ) : (
                    <div className="text-center">
                      No items found for this category
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center fs-4 mt-4">No categories found</div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}