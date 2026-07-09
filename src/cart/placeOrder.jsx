import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import styles from "./cart.module.css"
import FormPlaceOrder from "./form/placeOrder";
import Outfit from "./Outfit";
import Total from "./Total";
import Demo from "./Demo";

export default function PlaceOrder() {

    const navigate = useNavigate()

    const [selectedOutFit, setSelectedOutFit] = useState(0)
    const [submitting, setSubmitting] = useState(false)

    const pickOutFit = (index) => setSelectedOutFit(index)

    const isDesktop = useMediaQuery({ query: '(min-width: 1400px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 1000px)' })

    if (isMobile) {
        return (
            <div className={styles.body}>
                <section className={styles.main}>
                    <FormPlaceOrder formId={"placeOrderForm"} setSubmitting={setSubmitting} />
                </section>
                <section className={styles.primary}>
                    <Outfit pickOutFit={pickOutFit} />
                </section>
                <section className={styles.checkout}>
                    <div className={styles.submit}>
                        <Total />
                        <button className={styles.back} onClick={() => navigate('/cart')}>TRỞ VỀ</button>
                        <button className={styles.cta} type="submit" form="placeOrderForm" disabled={submitting}>{submitting ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}</button>
                    </div>
                </section>
            </div>
        );
    }

    // ponytail: at 1000-1400px, .checkout normally overlays the tail of
    // .primary (see cart.module.css) — right for a short action bar over a
    // long outfit list, wrong here where .checkout *is* the rental-date/
    // name/phone/address form. The demo board also doesn't fit: forcing
    // .primary into the same grid row as a tall board (both grid-column:2)
    // stretches .primary's empty box to match the board's height and
    // shoves .checkout down into its own far-away row. Simplest fix: drop
    // the demo board at this width and give outfit list / checkout form
    // their own column each, sized to their own content.
    if (!isDesktop) {
        return (
            <div className={styles.body}>
                <section className={styles.primary} style={{ position: "static", gridColumn: 1, gridRow: "auto" }}>
                    <Outfit pickOutFit={pickOutFit} />
                </section>
                <section className={styles.checkout} style={{ position: "static", gridColumn: 2, gridRow: "auto" }}>
                    <FormPlaceOrder formId={"placeOrderForm"} setSubmitting={setSubmitting} />
                    <div className={styles.submit} style={{ padding: "1em 1.6em" }}>
                        <Total />
                        <button className={styles.back} onClick={() => navigate('/cart')}>TRỞ VỀ</button>
                        <button className={styles.cta} type="submit" form="placeOrderForm" disabled={submitting}>{submitting ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}</button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className={styles.body}>
            <section className={styles.main}>
                <Demo selectedOutFit={selectedOutFit} />
            </section>
            <section className={styles.primary}>
                <Outfit pickOutFit={pickOutFit} />
            </section>
            <section className={styles.checkout}>
                <FormPlaceOrder formId={"placeOrderForm"} setSubmitting={setSubmitting} />
                <div className={styles.submit} style={{ padding: "1em 1.6em" }}>
                    <Total />
                    <button className={styles.back} onClick={() => navigate('/cart')}>TRỞ VỀ</button>
                    <button className={styles.cta} type="submit" form="placeOrderForm" disabled={submitting}>{submitting ? "ĐANG XỬ LÝ..." : "THANH TOÁN"}</button>
                </div>
            </section>
        </div>
    );
}