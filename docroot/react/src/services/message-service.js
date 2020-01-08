import { Subject } from 'rxjs';

const subject = new Subject();

export const MessageService = {
    sendMessage: (message, data) => subject.next({ text: message, data: data }),
    clearMessages: () => subject.next(),
    getMessage: () => subject.asObservable()
};

export default MessageService;