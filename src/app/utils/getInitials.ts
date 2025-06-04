export const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    const initials = names.map(n => n[0].toUpperCase());
    return initials.slice(0, 2).join("");
};