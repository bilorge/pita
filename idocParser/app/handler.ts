// import {Logger} from "../../../libs/logger/logger";
import * as AWS from "aws-sdk";
import { Order } from "../src/models/Order";
import { PartnerID } from "../src/models/PartnerID";
import { ShippingDetails } from "../src/models/ShippingDetails";

// const log = Logger.getInstance();
const S3 = new AWS.S3();

class EventHandler {
    static async handleEvent(event) {

        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

        //this code block is to hand the incoming sns event
        const evt = event.Records[0].s3;
        console.log(evt);

        const bucketName = evt.bucket.name;
        const fileKey = evt.object.key;

        // const m1 = JSON.parse(event.Records[0].Sns.Message);
        // bucketName = m1.Records[0].s3.bucket.name;
        // fileKey = m1.Records[0].s3.object.key;
        console.log(bucketName);
        console.log(fileKey);

        //this code block is to handle the incoming sns event

        //for local testing
        // bucketName = 'wp-data-prod-zone';
        // fileKey = 'Source/SAP/WP_DELIVERY/ctrl1.json';

        const fileRef = await EventHandler.getIdocObjRef(bucketName, fileKey);
        if (EventHandler.qualifyDoc(fileRef)) {
            EventHandler.parseIdocFile(fileRef);
        }
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        return EventHandler.ping();
    }

    /**
     * Ensures the idoc meets the required criteria to be processed.
     * @param idoc
     */
    static qualifyDoc(idoc): boolean {
        if (idoc.DELVRY06.IDOC.E1EDL20[0].BOLNR &&
            idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL21.E1EDL23.LFART_BEZ === 'Delivery' &&
            EventHandler.hasTrackingNumbersCode(idoc)
        ) {
            return true; //file qualifies
        }
        return false;
    }

    static hasTrackingNumbersCode(idoc): boolean {
        let found = false;
        const codes = idoc.DELVRY06.IDOC.E1EDL20[0].E1TXTH8;
        console.log(codes);
        for (const code of codes) {
            if (code.TDID === 'Z006') {
                found = true;
                break;
            }
        }
        return found;
    }

    static parseIdocFile(idoc) {
        const order = new Order();

        order.documentType = idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL21.E1EDL23.LFART_BEZ;
        order.salesDocument = idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL24[0].E1EDL43[0].BELNR;
        order.orderBillingDetails.push(new PartnerID(idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[0].PARTNER_Q, idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[0].PARTNER_ID));
        order.orderBillingDetails.push(new PartnerID(idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[2].PARTNER_Q, idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[2].PARTNER_ID));
        order.purchaseOrder = (idoc.DELVRY06.IDOC.E1EDL20[0].E1EDL24[0].E1EDL41[0].BSTNR);
        const shippingDetails = new ShippingDetails(idoc.DELVRY06.IDOC.E1EDL20[0].E1ADRM1[1].NAME1, idoc.DELVRY06.IDOC.E1EDL20[0].VSBED);

        EventHandler.extractTrackingNumbers(idoc.DELVRY06.IDOC.E1EDL20[0].E1TXTH8, shippingDetails);
        order.shippingInformation = shippingDetails;
        console.log(order);

        EventHandler.publishUpdate(order);
        console.log('Message Published!!');
    }

    static async publishUpdate(order: Order) {
        if(!process.env.ORDERSNS) {
            console.log(process.env);
            console.log('The environment variable for the SNS endpoint is not defined!!!');
            throw new Error('The environment variable for the SNS endpoint is not defined!!!');
        }
        
        const sns = new AWS.SNS();
        console.log('Queue to publish: ' + process.env.ORDERSNS);
        console.log('Paylod: \n' + JSON.stringify(order));
        
        const payload = {
            Message: JSON.stringify(order),
            TopicArn: process.env.ORDERSNS,
        }
        
        await sns.publish(payload).promise();
    }

    static extractTrackingNumbers(idoc, deets: ShippingDetails) {
        // DELVRY06.IDOC.E1EDL20[0].E1TXTH8
        idoc.map(e => {
            if (e.TDID === 'Z006') {
                deets.orderTrackingNumbers.push(e.E1TXTP8[0].TDLINE);
            }
        });
    }

    /**
     * The function returns an object reference to the content of the idoc file.
     * The function throws a generic exception.
     * @param bucket
     * @param key
     */
    static async getIdocObjRef(bucket, key) {
        const params = {
            Bucket: bucket,
            Key: key
        };

        const payload = await S3.getObject(params).promise();
        const parsedPayload = JSON.parse(payload.Body.toString());
        return parsedPayload;
    }

    static async ping() {
        return EventHandler.echo();
    }

    static echo() {
        const doink = {
            status: 200,
            body: "Echo"
        }
        return doink;
    }

}

export const track = EventHandler.handleEvent;
export const ping = EventHandler.ping;
