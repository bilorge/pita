/**
 * this object represent the "partner" type of the idoc. The idoc contains varios types of partner types, however,
 * the ones that matter are AG and WE. The partner types can located in the following location:
 * idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[0].PARTNER_Q -> generally contains "AG", however, not guaranteed
 * idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[0].PARTNER_ID When the value is "AG" this is the "Sold to Party" ID
 * idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[2].PARTNER_Q  -> generally contains "WE", however, not guaranteed
 * idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[2].PARTNER_ID -> When the value is "WE" this is the "Ship to Party" ID
 */
export class PartnerID {

    // private partnerCodeIdentifier: string; // Possible values: AG | WE
    // private partnerAcctID: string
    constructor(private partnerCodeIdentifier, private partnerAcctID) {
    }

    get partnerAccountID(): string {
        return this.partnerAcctID;
    }

    set partnerAccountID(value: string) {
        this.partnerAcctID = value;
    }

    get partnerCode(): string {
        return this.partnerCodeIdentifier;
    }

    set partnerCode(value: string) {
        this.partnerCodeIdentifier = value;
    }
}

