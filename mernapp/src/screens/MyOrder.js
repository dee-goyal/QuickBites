import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
  const [orderGroups, setOrderGroups] = useState(null);

  useEffect(() => {
    const fetchMyOrder = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        if (!email) throw new Error('No user email in storage');

        const res = await fetch('http://localhost:5000/api/myOrderData', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const response = await res.json();
        const orderData = response.orderData;
        
        if (!orderData || !orderData.order_data) {
          setOrderGroups([]);
          return;
        }

        // Process the existing order_data structure
        const processedGroups = [];
        let currentDate = null;
        let currentItems = [];
        
        // Flatten the array first (since some items might be nested)
        const flatData = orderData.order_data.flat(Infinity);
        
        for (const item of flatData) {
          if (item.Order_date) {
            // If we have a current date and items, push them before starting new group
            if (currentDate) {
              processedGroups.push({
                date: currentDate,
                items: [...currentItems]
              });
              currentItems = [];
            }
            currentDate = item.Order_date;
          } else if (currentDate && item.name) {
            currentItems.push(item);
          }
        }

        // Push the last group if it exists
        if (currentDate && currentItems.length > 0) {
          processedGroups.push({
            date: currentDate,
            items: currentItems
          });
        }

        // Reverse to show newest first
        setOrderGroups(processedGroups.reverse());
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrderGroups([]);
      }
    };

    fetchMyOrder();
  }, []);

  if (orderGroups === null) {
    return (
      <>
        <Navbar />
        <div className="container text-center mt-5">
          <p>Loading your orders…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {orderGroups.length === 0 ? (
          <p className="text-center">You have no past orders.</p>
        ) : (
          <div>
            {orderGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-5">
                <h4 className="border-bottom pb-2 mb-3">
                  Order Date: {new Date(group.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                <div className="row">
                  {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="col-12 col-sm-6 col-lg-3 mb-4">
                      <div className="card h-100">
                        <img
                          src={item.img || '/placeholder.png'}
                          className="card-img-top"
                          alt={item.name}
                          style={{ height: '150px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '/placeholder.png';
                          }}
                        />
                        <div className="card-body p-3">
                          <h5 className="card-title">{item.name}</h5>
                          <p className="mb-1">
                            Qty: {item.qty} &bull; Size: {item.size}
                          </p>
                          <p className="fw-bold">₹{item.price}/-</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}