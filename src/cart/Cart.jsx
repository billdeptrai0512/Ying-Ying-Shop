import { useState } from "react"
import styles from "./Cart.module.css"


// import fullset from "../../assets/demo/fullset.png"

export default function Cart({ cart }) {
    console.log(cart);

    return (
        <div>
            <h2>Cart Items</h2>
            {cart.item?.map((item, index) => (
                <div key={index} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
                    <h3>Item {index + 1}</h3>
                    {item.bottom?.item && (
                        <div>
                            <p>Bottom ID: {item.bottom.item.id}</p>
                            <img src={item.bottom.item.image} alt="Bottom Item" width="50" />
                            <p>Size: {item.bottom.size}</p>
                        </div>
                    )}
                    {item.top?.item && (
                        <div>
                            <p>Top Size: {item.top.size}</p>
                        </div>
                    )}
                    <p>Total: {item.total}</p>
                </div>
            ))}
        </div>
    );
}