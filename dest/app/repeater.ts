
class Repeater {
    static handle(event) {
        const message = event.Records[0].Sns.Message;
        console.log(message);
    }
}

export const repeat = Repeater.handle;