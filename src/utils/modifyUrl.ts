export const modifyUrl = async (modifier: (params: URLSearchParams) => void): Promise<string> => {
    const searchParams = new URLSearchParams(window.location.search);
    modifier(searchParams);
    return `${window.location.pathname}?${searchParams.toString()}`;
};