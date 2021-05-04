// import {Logger} from "../../../libs/logger/logger";
import * as AWS from "aws-sdk";


class EventHandler {
    static async handleEvent(event) {
        console.log(event);
        const sns = new AWS.SNS;
        const message = ">>>>>>>>>>>>>>>>>>>>>> EVENT FIRED!! <<<<<<<<<<<<<<<<<<<<<<<<";
        const params = {
            Message: message,
            TopicArn: `arn:aws:sns:us-east-1:099681287254:notifierTopic`,
        };
        await sns.publish(params).promise();
        console.log('Published the message!');
    }
}

export const track = EventHandler.handleEvent;

