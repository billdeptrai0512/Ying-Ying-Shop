import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from "@testing-library/user-event";

import Item from './item';

describe("Item component", () => {

    const top = {
        type: "top",
        name: "Áo sơ mi / Sailor",
        inventory: [
            {
                id: 1,
                image: "A",
                amount: 10,
                size: ["S", "M", "L", "XL"]
            },
            {
                id: 2,
                image: "B",
                amount: 20,
                size: ["S", "XL"]
            },
            {
                id: 3,
                image: "C",
                amount: 15,
                size: ["M", "L", "XL"]
            },
            {
                id: 4,
                image: "D",
                amount: 15,
                size: ["M", "XXL", "XL"]
            },
            {
                id: 5,
                image: "E",
                amount: 15,
                size: ["S", "M", "XL"]
            },
        ]
    } 

    const UpdateOutFit = vi.fn()
    const UpdateSize = vi.fn()
    it("render all image in the inventory", () => {

        render(<Item props={top} UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize}/>);

        const imageContainer = document.querySelector('div._image_95376f')
        expect(imageContainer.children.length).toBe(top.inventory.length)

    });

    it("reder amount + size when user click the image", async () => {

        render(<Item props={top} UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize}/>);

        const user = userEvent.setup()
        const imageContainer = document.querySelector('div._image_95376f')
        const image = imageContainer.children[0]
        
        await user.click(image)

        const sizeContainer = document.querySelector('div._options_95376f')
        const amountContainer = document.querySelector('._amount_95376f')

        expect(amountContainer.textContent).toBe(`Số lượng: ${top.inventory[0].amount}`)
        expect(sizeContainer.children.length).toBe(top.inventory[0].size.length)


    });

    it("unmounted amount + size when user click image twice ", async () => {

        render(<Item props={top} UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize}/>);

        const user = userEvent.setup()
        const imageContainer = document.querySelector('div._image_95376f')
        const image = imageContainer.children[0]
        
        await user.click(image)

        const sizeContainer = document.querySelector('div._options_95376f')
        const amountContainer = document.querySelector('._amount_95376f')

        await user.click(image)

        expect(amountContainer).not.toBeInTheDocument()
        expect(sizeContainer).not.toBeInTheDocument()


    });

    it("reder amount + size again when user click other image", async () => {

        render(<Item props={top} UpdateOutFit={UpdateOutFit} UpdateSize={UpdateSize}/>);

        const user = userEvent.setup()
        const imageContainer = document.querySelector('div._image_95376f')
        const image1 = imageContainer.children[0]
        const image2 = imageContainer.children[2]
        
        await user.click(image1)
        await user.click(image2)

        const sizeContainer = document.querySelector('div._options_95376f')
        const amountContainer = document.querySelector('._amount_95376f')

        expect(amountContainer.textContent).toBe(`Số lượng: ${top.inventory[2].amount}`)
        expect(sizeContainer.children.length).toBe(top.inventory[2].size.length)


    });

  });