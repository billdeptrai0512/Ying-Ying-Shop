import styles from "../Body.module.css"
import Item from "../../Item/Item"
import Extra from "../../Item/Extra"
import CheckOut from "./Checkout"
import { useOutletContext } from "react-router-dom"

export default function PickItem({saveOutFitInCart}) {

    const { outFit, inventory, UpdateOutFit, UpdateSize, missingSize, setMissingSize, resetTrigger, setBottomSelected, bottomSelected, setJacketSelected, jacketSelected, resetDefault } = useOutletContext();

    return (
        <>
            <div className={styles.primary}>
                <Item props={inventory.top} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.bottom_short} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setBottomSelected} isChoosen={bottomSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.bottom_long} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setBottomSelected} isChoosen={bottomSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Item props={inventory.sweater} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
            </div>
            <div className={styles.secondary}>
                <Item props={inventory.gakuran} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setJacketSelected} isChoosen={jacketSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger} />
                <Item props={inventory.blazer} UpdateSize={UpdateSize} UpdateOutFit={UpdateOutFit} setChoosen={setJacketSelected} isChoosen={jacketSelected} missingSize={missingSize} setMissingSize={setMissingSize} resetTrigger={resetTrigger}/>
                <Extra props={inventory.extra} UpdateOutFit={UpdateOutFit} resetTrigger={resetTrigger}/> 
                <CheckOut 
                    setMissingSize={setMissingSize}
                    saveOutFitInCart={saveOutFitInCart}
                    outFit={outFit}
                    resetDefault={resetDefault}
                />
            </div> 
        </>

    )
}