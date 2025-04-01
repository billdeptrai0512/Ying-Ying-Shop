import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";

import Body from './body';

describe("Body component", () => {

    const outfit = {
        top: [] ,
        bottom: [],
        sweater: [],
        jacket: [],
        bow: [],
        bag: [],
        total: 0
    }

    // eslint-disable-next-line no-unused-vars
    const top = {
        type: "top",
        name: "Áo sơ mi / Sailor",
        inventory: [
            {
                id: 1,
                image: "A",
                amount: 10,
                size: ["S", "M", "L", "XL"],
                total: 50000
            },
            {
                id: 2,
                image: "B",
                amount: 20,
                size: ["S", "XL"],
                total: 60000
            },
            {
                id: 3,
                image: "C",
                amount: 15,
                size: ["M", "L", "XL"],
                total: 70000
            },
            {
                id: 4,
                image: "D",
                amount: 15,
                size: ["M", "XXL", "XL"],
                total: 80000
            },
            {
                id: 5,
                image: "E",
                amount: 15,
                size: ["S", "M", "XL"],
                total: 90000
            },
        ]
    } 

    it("render total payment = 0 at default", async() => {

        render(<Body />);

        const totalText = await screen.findByTestId('total-text');
        expect(totalText).toHaveTextContent(`Tổng tiền: ${outfit.total}đ`);

    });

    it("render total payment = item.total when user click the image", async () => {

        render(<Body />);

        const user = userEvent.setup()

        const imageContainer = document.querySelector('div._image_95376f')
        const image = imageContainer.children[0]

        await user.click(image)

        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalText = await screen.findByTestId('total-text');
        expect(totalText).toHaveTextContent(`Tổng tiền: 50,000đ`);

    });

    it("render total payment = 0 when user double click the image", async () => {

        render(<Body />);

        const user = userEvent.setup()

        const imageContainer = document.querySelector('div._image_95376f')
        const image = imageContainer.children[0]

        await user.click(image)
        await user.click(image)

        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalText = await screen.findByTestId('total-text');
        expect(totalText).toHaveTextContent(`Tổng tiền: 0đ`);

    });

    it("render total payment = item number 2 when user click another image", async () => {

        render(<Body />);

        const user = userEvent.setup()

        const imageContainer = document.querySelector('div._image_95376f')
        const image = imageContainer.children[0]
        const image2 = imageContainer.children[2]

        await user.click(image)
        await user.click(image2)

        await new Promise(resolve => setTimeout(resolve, 1000));

        const totalText = await screen.findByTestId('total-text');
        expect(totalText).toHaveTextContent(`Tổng tiền: 30,000đ`);
    });



});