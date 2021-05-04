import {ShippingDetails} from "./ShippingDetails";
import {PartnerID} from "./PartnerID";

export class Order {
    get shippingInformation(): ShippingDetails {
        return this.shippingInfo;
    }

    set shippingInformation(value: ShippingDetails) {
        this.shippingInfo = value;
    }
    get purchaseOrder(): string {
        return this.po;
    }

    set purchaseOrder(value: string) {
        this.po = value;
    }
    get orderBillingDetails(): PartnerID[] {
        return this.billingDetails;
    }

    set orderBillingDetails(value: PartnerID[]) {
        this.billingDetails = value;
    }
    get salesDocument(): string {
        return this.salesDoc;
    }

    set salesDocument(value: string) {
        this.salesDoc = value;
    }
    get documentType(): string {
        return this.idocType;
    }

    set documentType(value: string) {
        this.idocType = value;
    }

    public getCreateDTM(): string {
        return this.createDTM;
    }

    private readonly createDTM: string = new Date().toISOString(); //generated upon creation
    private idocType: string; //idoc type - idoc.DELVRY06.IDOC.EDI_DC40.IDOCTYP
    private salesDoc: string; // SAP internal reference - idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL24[0].VGBEL or idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL24[0].E1EDL43[0].BELNR
    private billingDetails: PartnerID[] = [];
    private po: string; //idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL24[0].E1EDL41[0].BSTNR
    private shippingInfo: ShippingDetails;

}
