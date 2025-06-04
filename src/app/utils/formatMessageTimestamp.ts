export const formatMessageTimestamp = (createdAt: string | Date | undefined) => {
    if (!createdAt) return "";

    const messageDate = new Date(createdAt);
    // const localDate = new Date(
    //     messageDate.getTime() - messageDate.getTimezoneOffset() * 60000
    // );
    const currentDate = new Date();

    const messageYear = messageDate.getFullYear();
    const messageMonth = messageDate.getMonth();
    const messageDay = messageDate.getDate();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const isToday =
        messageYear === currentYear &&
        messageMonth === currentMonth &&
        messageDay === currentDay;

    const isYesterday =
        messageYear === currentYear &&
        messageMonth === currentMonth &&
        messageDay === currentDay - 1;

    if (isToday) {
        return messageDate.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    } else if (isYesterday) {
        return "Yesterday";
    } else {
        return messageDate.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }
};