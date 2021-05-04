/**
 * This object refers to the shipping infomation extracted from the idoc. The fields related to shipping are below:
 * idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[1].NAME1 -> This is the carrier Name
 * idoc.DELVRY06.IDOC.E1EDL20[0].VSBED -> this is the shipping condition
 *
 * idoc.DELVRY06.IDOC.E1EDL20[0].BOLNR -> We assume this is the master tracking number. All tracking numbers in the idoc appear to reside in the
 * idoc.DELVRY06.IDOC.E1EDL20[0].E1TXTH8 element. The elemnt hold an array objects onle the objects which have a key value pair of TDID: Z006 seem to have
 * tracking numbers in the property "E1TXTP8[x].TDLINE"
 * Full path: idoc.DELVRY06.IDOC.E1EDL20[0].E1TXTH8[0].E1TXTP8[0].TDLINE
 */
export class ShippingDetails {
    get CarrierShippingCondition() {
        return this.shippingCondition;
    }

    set CarrierShippingCondition(value) {
        this.shippingCondition = value;
    }
    get OrderCarrierName(): string {
        return this.carrierName;
    }

    set OrderCarrierName(value: string) {
        this.carrierName = value;
    }
    get orderTrackingNumbers(): string[] {
        return this.trackingNumbers;
    }

    set orderTrackingNumbers(value: string[]) {
        this.trackingNumbers = value;
    }

    private trackingNumbers: string[] = [];
    // private carrierName: string;
    // private shippingCondition;

    constructor(private carrierName: string, private shippingCondition: string) {
    }

}
