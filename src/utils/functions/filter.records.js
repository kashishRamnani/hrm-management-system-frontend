export default (data = [], query) => {
    if (!query) return data;

    return data.filter(item => {
        return Object.values(item).some(value => {
            return (typeof value === 'string') && value.toLowerCase().includes(query.toLowerCase());
        });
    });
};