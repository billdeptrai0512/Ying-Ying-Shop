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

    // 1000px–1400px (laptop) and >=1400px (desktop) both show the demo
    // board — only the grid (2 vs 3 columns) differs, handled by CSS.
    //
    // ponytail: at laptop width, column 2 normally lets .checkout overlay
    // the tail of .primary (see cart.module.css) — right for a short
    // action bar over a long outfit list, wrong here where .checkout *is*
    // the rental-date/name/phone/address form: overlaying it would just
    // hide the outfit summary completely instead of showing both. Forcing
    // both back to normal flow (static, auto row) stacks them instead.
    const stackNormally = isDesktop ? undefined : { position: "static", gridRow: "auto" };

    return (
        <div className={styles.body}>
            <section className={styles.main}>
                <Demo selectedOutFit={selectedOutFit} />
            </section>
            <section className={styles.primary} style={stackNormally}>
                <Outfit pickOutFit={pickOutFit} />
            </section>
            <section className={styles.checkout} style={stackNormally}>
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