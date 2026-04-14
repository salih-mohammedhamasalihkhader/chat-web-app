export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface MessageWithSender extends Message {
    senderName?: string;
    senderProfilePic?: string;
}
