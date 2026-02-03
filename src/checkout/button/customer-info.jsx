import styles from "../checkout.module.css";

export default function CustomerInfo({ order, cart }) {
    const itemCount = countItems(cart);

    return (
        <div className={styles.customerInfo}>
            <InfoRow label="Họ và tên:" value={order.name} />
            <InfoRow label="Số điện thoại:" value={`(+84) ${order.phone}`} />
            <InfoRow
                label={`Đặt ${itemCount} sản phẩm`}
                value={new Date(order.date).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })}
            />
            <InfoRow label="Địa chỉ nhận hàng:" value={order.address} />
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className={styles.infoRow}>
            <p className={styles.copyable}>{label}</p>
            <p className={styles.copyable}>{value}</p>
        </div>
    );
}

// Count all items in cart
function countItems(cart) {
    if (!cart || cart.length === 0) return 0;

    let result = 0;

    const count = (section) => {
        if (section && typeof section === 'object') {
            if ('item' in section) {
                if (section.item !== null) {
                    result += 1;
                }
            }

            Object.values(section).forEach(value => {
                if (typeof value === 'object') {
                    count(value);
                }
            });
        }
    };

    cart.forEach(outfit => {
        Object.values(outfit).forEach(section => {
            count(section);
        });
    });

    return result;
}
